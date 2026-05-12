import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpCode,
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

  @Get('stats')
  async getStats() {
    return this.service.getStats();
  }

  @Get()
  async getAll() {
    return this.service.getAllSubmissions();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getSubmissionById(id);
  }
}