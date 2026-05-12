import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PayloadParserService } from './services/payload-parser.service';

@Injectable()
export class AidaformService {
  private readonly logger = new Logger(AidaformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: PayloadParserService,
  ) {}

  async handleWebhook(body: any) {
    this.logger.debug(`Incoming Payload: ${JSON.stringify(body)}`);

    const parsed = this.parser.parseAnswers(body);

    try {
      const result = await this.prisma.surveySubmission.create({
        data: {
          submissionId: body.submission_id,
          payload: body,
          parsedAnswers: parsed,
        },
      });

      return {
        success: true,
        id: result.id,
        submissionId: body.submission_id,
      };
    } catch (error) {
      this.logger.error('Webhook save error', error);
      return {
        success: true,
        status: 'duplicate_ignored',
      };
    }
  }

  async getAllSubmissions() {
    const data = await this.prisma.surveySubmission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    this.logger.debug(`GET ALL: ${data.length} submissions`);

    return data;
  }

  async getSubmissionById(id: string) {
    const data = await this.prisma.surveySubmission.findUnique({
      where: {
        submissionId: id,
      },
    });

    this.logger.debug(`GET ONE: ${id} -> ${data ? 'FOUND' : 'NOT FOUND'}`);

    return data;
  }

  async getStats() {
    this.logger.debug('STATS ENDPOINT HIT');

    const submissions = await this.prisma.surveySubmission.findMany();

    this.logger.debug(
      `TOTAL SUBMISSIONS: ${submissions.length}`,
    );

    const parsedDump = submissions.map((s) => s.parsedAnswers);

    this.logger.debug(
      `PARSED ANSWERS RAW: ${JSON.stringify(parsedDump)}`,
    );

    const typeCount: Record<string, number> = {};

    for (const s of submissions) {
      const parsed = (s.parsedAnswers as any[]) ?? [];

      for (const a of parsed) {
        const type = a?.type ?? 'unknown';
        typeCount[type] = (typeCount[type] || 0) + 1;
      }
    }

    const result = {
      totalSubmissions: submissions.length,
      questionTypeDistribution: typeCount,
      lastUpdate: new Date(),
    };

    this.logger.debug(`STATS RESULT: ${JSON.stringify(result)}`);

    return result;
  }
}