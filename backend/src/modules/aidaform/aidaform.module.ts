import { Module } from '@nestjs/common';

import { AidaformController } from './aidaform.controller';
import { AidaformService } from './aidaform.service';

import { PayloadParserService } from './services/payload-parser.service';

import { PrismaService } from '../../../prisma/prisma.service';


@Module({
  controllers: [AidaformController],
  providers: [
    AidaformService,
    PayloadParserService,
    PrismaService,
  ],
})
export class AidaformModule {}