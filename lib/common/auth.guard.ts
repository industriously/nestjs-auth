import { Strategy } from '@INTERFACE/common.interface';
import { GoogleStrategy } from '@LIB/google/google.strategy';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(GoogleStrategy)
    protected readonly strategy: Strategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (this.strategy.isOauthCallback(request)) {
      await this.strategy.authorize(request);
      return this.strategy.validate(request);
    } else {
      const handler = context.getHandler();
      handler.apply = () => response.redirect(this.strategy.OAUTH2_URI);
      return true;
    }
  }
}
