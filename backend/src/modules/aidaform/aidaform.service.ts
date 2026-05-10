import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AidaformService {
  private readonly logger = new Logger(AidaformService.name);

  async handleIncomingWebhook(body: any, headers: any) {
    const requestId = headers['x-request-id'] ?? 'missing-request-id';

    this.logger.log({
      event: 'webhook_received',
      requestId,
    });

    try {
      const isValid = this.validateSignature(headers);

      if (!isValid) {
        this.logger.warn({
          event: 'invalid_signature',
          requestId,
        });

        return {
          success: false,
          message: 'Unauthorized',
        };
      }

      await this.saveRawPayload(body, headers, requestId);

      this.logger.log({
        event: 'webhook_accepted',
        requestId,
      });

      return {
        success: true,
        message: 'Webhook received',
      };

    } catch (error: unknown) {
      const err = this.normalizeError(error);

      this.logger.error({
        event: 'webhook_error',
        requestId,
        error: err.message,
      });

      throw new InternalServerErrorException('Processing failed');
    }
  }

  private validateSignature(headers: any): boolean {
    // Phase 3: HMAC signature validation
    return true;
  }

  private async saveRawPayload(
    body: any,
    headers: any,
    requestId: string,
  ) {
    try {
      const dir = path.resolve('./storage');

      await fs.mkdir(dir, { recursive: true });

      const filePath = path.join(
        dir,
        `aidaform-${Date.now()}-${requestId}.json`,
      );

      await fs.writeFile(
        filePath,
        JSON.stringify(
          {
            requestId,
            body,
            headers,
            receivedAt: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
    } catch (error) {
      this.logger.error({
        event: 'file_write_failed',
        requestId,
        error: this.normalizeError(error).message,
      });

      throw error;
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error(String(error));
  }
}