import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';

import { AidaformService } from './aidaform.service';

@Controller('webhooks/aidaform')
export class AidaformController {
  constructor(
    private readonly service: AidaformService,
  ) {}

  @Post()
  @HttpCode(200)
  async receive(@Body() body: any) {
    return this.service.handleWebhook(body);
  }
}