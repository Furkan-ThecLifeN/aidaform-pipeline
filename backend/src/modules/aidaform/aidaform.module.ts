import { Module } from '@nestjs/common';
import { AidaformController } from './aidaform.controller';
import { AidaformService } from './aidaform.service';

@Module({
  controllers: [AidaformController],
  providers: [AidaformService]
})
export class AidaformModule {}
