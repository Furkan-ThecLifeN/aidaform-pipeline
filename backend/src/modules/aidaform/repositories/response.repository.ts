import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ResponseRepository {
  constructor(private prisma: PrismaService) {}

  async save(normalizedData: any) {
    return this.prisma.surveyResponse.create({
      data: {
        submissionId: normalizedData.submissionId,
        answers: normalizedData.answers,
      },
    });
  }
}