import { Strategy } from '@INTERFACE/common.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common';
import { Request, Response } from 'express';

export const AuthGuard = <T>(token: T): Type<CanActivate> => {
  class MixinGuard implements CanActivate {
    constructor(
      @Inject(token)
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
  return mixin(MixinGuard);
};
