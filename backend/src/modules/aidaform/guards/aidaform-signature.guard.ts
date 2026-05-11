import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AidaformSignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const signature = req.headers['x-aida-signature'];
    const secret = process.env.AIDAFORM_SECRET;

    if (!signature || !secret) {
      throw new UnauthorizedException('Missing signature or secret');
    }

    const rawBody = req.body?.toString();

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expected) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}