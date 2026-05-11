import { Injectable } from '@nestjs/common';

@Injectable()
export class NormalizationService {
  normalize(payload: any) {
    return {
      submissionId: payload.submission_id,
      answers: (payload.answers || []).map((a: any) => ({
        question: a.question?.trim(),
        value: a.value,
        key: this.slugify(a.question) 
      })),
    };
  }

  private slugify(text: string): string {
    return text?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || 'unknown';
  }
}