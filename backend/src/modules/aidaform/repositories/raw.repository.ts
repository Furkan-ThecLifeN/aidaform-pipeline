import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class RawRepository {
  constructor(private prisma: PrismaService) {}

  async exists(submissionId: string) {
    return this.prisma.surveyRawSubmission.findUnique({
      where: { submissionId },
      select: { id: true }, 
    });
  }

  async save(data: any, headers: any) {
    return this.prisma.surveyRawSubmission.create({
      data: {
        submissionId: data.submission_id,
        payload: data,
        headers,
      },
    });
  }
}