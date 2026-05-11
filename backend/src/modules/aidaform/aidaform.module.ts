import { Module } from '@nestjs/common';
import { AidaformController } from './aidaform.controller';
import { AidaformService } from './aidaform.service';
import { PayloadAnalyzerService } from './services/payload-analyzer.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [AidaformController],
  providers: [
    AidaformService, 
    PayloadAnalyzerService, 
    PrismaService,        
  ],
})
export class AidaformModule {}