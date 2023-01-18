import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
} from '@nestjs/common';
import { Strategy, Request, Response, authenticate } from '@COMMON';

/**
 * If you want to create custom Guard, extend AbstractAuthGuard.
 * the Strategy will be injected by nestjs module
 * you have to add @Injectable decorator on AuthGuard extends AbstractAuthGuard
 */
export abstract class AbstractAuthGuard implements CanActivate {
  constructor(protected readonly strategy: Strategy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const result = await authenticate(this.strategy)(request);
    if (result.type === 'OAUTH2') {
      const handler = context.getHandler();
      handler.apply = () => response.redirect(result.redirect_url);
      return true;
    }
    return result.isSuccess;
  }
}
/**
 * @param token this is a marking as a target for Dependency Injection (DI).
 * In nestjs module, you have to provide this token with Strategy
 * @returns MixInGuard extends AbstractAuthGuard
 */
export const AuthGuard = <S>(token: S): Type<AbstractAuthGuard> => {
  class MixinGuard extends AbstractAuthGuard {
    constructor(@Inject(token) strategy: Strategy) {
      super(strategy);
    }
  }
  return mixin(MixinGuard);
};
