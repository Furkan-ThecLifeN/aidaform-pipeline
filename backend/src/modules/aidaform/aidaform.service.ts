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
    this.logger.debug(
      `Incoming Payload: ${JSON.stringify(body)}`,
    );

    const parsed = this.parser.parseAnswers(body);

    try {
      const result =
        await this.prisma.surveySubmission.create({
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
      return {
        success: true,
        status: 'duplicate_ignored',
      };
    }
  }
}