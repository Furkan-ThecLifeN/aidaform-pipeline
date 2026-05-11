import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RawRepository } from './repositories/raw.repository';
import { ResponseRepository } from './repositories/response.repository';
import { NormalizationService } from './services/normalization.service';

@Injectable()
export class AidaformService {
  private readonly logger = new Logger(AidaformService.name);

  constructor(
    private readonly rawRepo: RawRepository,
    private readonly responseRepo: ResponseRepository,
    private readonly normalizer: NormalizationService,
  ) {}

  async handleIncomingWebhook(rawBody: string, headers: any) {
    const payload = JSON.parse(rawBody);

    try {
      const exists = await this.rawRepo.exists(payload.submission_id);
      if (exists) {
        this.logger.warn(`Duplicate submission: ${payload.submission_id}`);
        return { status: 'duplicate' };
      }

      await this.rawRepo.save(payload, headers);

      const normalized = this.normalizer.normalize(payload);

      const savedResponse = await this.responseRepo.save(normalized);

      this.logger.log(`Success processing: ${payload.submission_id}`);

      return {
        status: 'success',
        submissionId: payload.submission_id,
        dbId: savedResponse.id
      };
    } catch (error) {
      this.logger.error('Data pipeline error:', error);
      throw new InternalServerErrorException('Webhook pipeline failed');
    }
  }
}