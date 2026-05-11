import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PayloadAnalyzerService } from './services/payload-analyzer.service';

@Injectable()
export class AidaformService {
  private readonly logger = new Logger(AidaformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyzer: PayloadAnalyzerService,
  ) {}

  async handleIncomingWebhook(rawBody: string, headers: any) {
    const data = JSON.parse(rawBody);
    const requestId = headers['x-request-id'] ?? 'missing';

    try {
      const existing = await this.prisma.surveyRawSubmission.findUnique({
        where: {
          submissionId: data.submission_id,
        },
      });

      if (existing) {
        return { status: 'duplicate' };
      }

      const saved = await this.prisma.surveyRawSubmission.create({
        data: {
          submissionId: data.submission_id,
          payload: data,
        },
      });

      const analysis = this.analyzer.analyze(data);

      return {
        status: 'success',
        id: saved.id,
        analysis,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Webhook failed');
    }
  }
}