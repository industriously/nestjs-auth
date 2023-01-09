import { Strategy } from '@INTERFACE/common.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common';
import { Request, Response } from 'express';

export abstract class AbstractAuthGuard<T = unknown> implements CanActivate {
  constructor(protected readonly strategy: Strategy<T>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (this.strategy.isOauthCallback(request)) {
      await this.strategy.authorize(request);
      return this.strategy.validate(this.strategy.getData(request));
    } else {
      const handler = context.getHandler();
      handler.apply = () => response.redirect(this.strategy.OAUTH2_URI);
      return true;
    }
  }
}

export const AuthGuard = <S, T = unknown>(
  token: S,
): Type<AbstractAuthGuard<T>> => {
  class MixinGuard extends AbstractAuthGuard<T> {
    constructor(@Inject(token) strategy: Strategy<T>) {
      super(strategy);
    }
  }
  return mixin(MixinGuard);
};
