import { Strategy } from '@INTERFACE/common.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 *
 * @param strategy oauth2 인증관련 세부 정보와 로직을 가지고 있다.
 * @param verify 인증 정보를 검토한다. default로 무조건 허용한다.
 * @returns Injectable Provider implemented CanActivate interface
 * @throws verify 실패시 verify함수의 두번째 인자를 throw한다.
 */
export const createAuthGuard = (
  strategy: Strategy,
  verify: (req: Request, exception: unknown) => Promise<boolean> = async () =>
    true,
) => {
  @Injectable()
  class Guard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      const path: string = request.route.path;

      strategy.isOauthCallback(path)
        ? await strategy.authorize(request)
        : response.redirect(strategy.OAUTH2_URI);

      return verify(request, new UnauthorizedException());
    }
  }

  return Guard;
};
