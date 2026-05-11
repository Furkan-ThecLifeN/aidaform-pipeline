import {
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AidaformService } from './aidaform.service';
import { AidaformSignatureGuard } from './guards/aidaform-signature.guard';

@Controller('webhooks/aidaform')
export class AidaformController {
  constructor(private readonly service: AidaformService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AidaformSignatureGuard)
  async handleWebhook(@Req() req: any) {
    const rawBody = req.body.toString();

    return this.service.handleIncomingWebhook(
      rawBody,
      req.headers,
    );
  }
}