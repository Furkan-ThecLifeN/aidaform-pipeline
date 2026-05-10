import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
} from '@nestjs/common';
import { AidaformService } from './aidaform.service';

@Controller('webhooks/aidaform')
export class AidaformController {
  constructor(private readonly aidaformService: AidaformService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, any>,
  ) {
    return this.aidaformService.handleIncomingWebhook(body, headers);
  }
}