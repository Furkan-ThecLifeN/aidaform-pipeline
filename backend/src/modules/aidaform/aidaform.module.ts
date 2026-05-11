import { Module } from '@nestjs/common';
import { AidaformController } from './aidaform.controller';
import { AidaformService } from './aidaform.service';
import { PayloadAnalyzerService } from './services/payload-analyzer.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { NormalizationService } from './services/normalization.service';
import { ResponseRepository } from './repositories/response.repository';
import { RawRepository } from './repositories/raw.repository';

@Module({
  controllers: [AidaformController],
  providers: [
    AidaformService,
    RawRepository,
    ResponseRepository,
    NormalizationService,
    PrismaService,
  ],
})
export class AidaformModule {}