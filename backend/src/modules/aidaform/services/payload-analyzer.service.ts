import { Injectable } from '@nestjs/common';

@Injectable()
export class PayloadAnalyzerService {
  
  analyze(payload: any) {
    const answers = payload?.answers || [];
    const normalized: Record<string, any> = {};

    for (const answer of answers) {
      if (answer.question) {
        const key = this.normalizeKey(answer.question);
        normalized[key] = answer.value;
      }
    }

    return {
      submissionId: payload?.submission_id || `unknown-${Date.now()}`,
      normalized,
      meta: {
        totalAnswers: answers.length,
        analyzedAt: new Date().toISOString(),
        source: 'aidaform_webhook',
      },
    };
  }


  private normalizeKey(key: string): string {
    return key
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_') 
      .replace(/[^a-z0-9_]/g, ''); 
  }
}