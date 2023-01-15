import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common';
import type { Strategy, Request, Response } from './common.interface';

export abstract class AbstractAuthGuard implements CanActivate {
  constructor(protected readonly strategy: Strategy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    if (this.strategy.isRedirectURL(request.path)) {
      const credentials = await this.strategy.authorize(
        this.strategy.getCode(request),
      );
      const identity = this.strategy.transform(
        await this.strategy.getIdentity(credentials),
      );
      this.strategy.saveIdentity(request, identity);
      return this.strategy.validate(identity, credentials);
    } else {
      const handler = context.getHandler();
      handler.apply = () => response.redirect(this.strategy.OAUTH2_URI);
      return true;
    }
  }
}

export const AuthGuard = <S>(token: S): Type<AbstractAuthGuard> => {
  class MixinGuard extends AbstractAuthGuard {
    constructor(@Inject(token) strategy: Strategy) {
      super(strategy);
    }
  }
  return mixin(MixinGuard);
};
