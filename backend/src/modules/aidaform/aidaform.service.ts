import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';

import { PayloadAnalyzerService } from './services/payload-analyzer.service';

type WebhookHeaders = Record<
  string,
  string | string[] | undefined
>;

interface SaveRawPayloadParams {
  submissionId: string;
  requestId: string;
  body: unknown;
  headers: WebhookHeaders;
}

@Injectable()
export class AidaformService {
  private readonly logger = new Logger(
    AidaformService.name,
  );

  private readonly STORAGE_DIR = path.resolve(
    './storage/raw',
  );

  constructor(
    private readonly analyzer: PayloadAnalyzerService,
  ) {}

  async handleIncomingWebhook(
    body: unknown,
    headers: WebhookHeaders,
  ) {
    const requestId =
      this.extractRequestId(headers);

    this.logger.log({
      event: 'webhook_received',
      requestId,
    });

    try {
      this.ensureSignatureIsValid(
        headers,
        requestId,
      );

      const submissionId =
        this.extractSubmissionId(body);

      await this.saveRawPayload({
        submissionId,
        requestId,
        body,
        headers,
      });

      const analysis =
        this.analyzer.analyze(body);

      this.logger.log({
        event: 'payload_analyzed',
        requestId,
        submissionId,
        normalizedKeys: Object.keys(
          analysis.normalized ?? {},
        ),
        totalAnswers:
          analysis.meta?.totalAnswers ?? 0,
      });

      this.logger.log({
        event: 'webhook_accepted',
        requestId,
        submissionId,
      });

      return {
        success: true,
        message:
          'Webhook received and processed successfully',
      };
    } catch (error: unknown) {
      const normalizedError =
        this.normalizeError(error);

      this.logger.error({
        event: 'webhook_processing_failed',
        requestId,
        error: normalizedError.message,
        stack: normalizedError.stack,
      });

      throw new InternalServerErrorException(
        'Webhook processing failed',
      );
    }
  }

  private ensureSignatureIsValid(
    headers: WebhookHeaders,
    requestId: string,
  ): void {
    const isValid =
      this.validateSignature(headers);

    if (isValid) {
      return;
    }

    this.logger.warn({
      event: 'invalid_signature',
      requestId,
    });

    throw new InternalServerErrorException(
      'Invalid webhook signature',
    );
  }

  private validateSignature(
    headers: WebhookHeaders,
  ): boolean {
    /**
     * FUTURE PHASE:
     * HMAC SHA256 verification
     */

    return true;
  }

  private async saveRawPayload(
    params: SaveRawPayloadParams,
  ): Promise<void> {
    const {
      submissionId,
      requestId,
      body,
      headers,
    } = params;

    try {
      await fs.mkdir(this.STORAGE_DIR, {
        recursive: true,
      });

      const filePath = path.join(
        this.STORAGE_DIR,
        `${submissionId}.json`,
      );

      const payload =
        this.buildStructuredPayload({
          submissionId,
          requestId,
          body,
          headers,
        });

      await fs.writeFile(
        filePath,
        JSON.stringify(payload, null, 2),
        'utf-8',
      );

      this.logger.log({
        event: 'raw_payload_saved',
        requestId,
        submissionId,
        filePath,
      });
    } catch (error: unknown) {
      const normalizedError =
        this.normalizeError(error);

      this.logger.error({
        event: 'raw_payload_save_failed',
        requestId,
        submissionId,
        error: normalizedError.message,
      });

      throw normalizedError;
    }
  }

  private buildStructuredPayload(
    params: SaveRawPayloadParams,
  ) {
    const {
      submissionId,
      requestId,
      body,
      headers,
    } = params;

    return {
      meta: {
        receivedAt: new Date().toISOString(),
        source: 'aidaform',
        requestId,
        version: 1,
      },

      internal: {
        submissionId,
      },

      raw: {
        body,
        headers,
      },
    };
  }

  private extractRequestId(
    headers: WebhookHeaders,
  ): string {
    const requestId =
      headers['x-request-id'];

    if (Array.isArray(requestId)) {
      return requestId[0];
    }

    return requestId ?? 'missing-request-id';
  }

  private extractSubmissionId(
    body: unknown,
  ): string {
    if (
      typeof body === 'object' &&
      body !== null &&
      'submission_id' in body
    ) {
      const submissionId = (
        body as Record<string, unknown>
      ).submission_id;

      if (
        typeof submissionId === 'string' &&
        submissionId.trim().length > 0
      ) {
        return this.sanitizeFileName(
          submissionId,
        );
      }
    }

    return `unknown-${Date.now()}`;
  }

  private sanitizeFileName(
    value: string,
  ): string {
    return value.replace(
      /[^a-zA-Z0-9-_]/g,
      '_',
    );
  }

  private normalizeError(
    error: unknown,
  ): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error(String(error));
  }
}