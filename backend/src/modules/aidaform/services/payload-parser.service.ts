import { Injectable } from '@nestjs/common';

@Injectable()
export class PayloadParserService {
  parseAnswers(payload: any) {
    if (!payload.answers || !Array.isArray(payload.answers)) {
      return [];
    }

    return payload.answers.map((answer: any) => ({
      question: answer.question || 'Unknown Question',
      value: answer.value,
      type: this.detectType(answer.value),
    }));
  }

  private detectType(value: any): string {
    if (Array.isArray(value)) {
      return 'multi_select_or_checkbox';
    }

    if (typeof value === 'boolean') {
      return 'boolean_yes_no';
    }

    if (typeof value === 'number') {
      return 'number_or_rating';
    }

    if (typeof value === 'string') {
      return 'text_or_dropdown';
    }

    return 'other';
  }
}