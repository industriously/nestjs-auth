import { CanActivate } from '@nestjs/common';
import { Request } from 'express';

export interface IAuthGuard extends CanActivate {
  /**
   * request를 통해 인증 정보가 유효한지 확인한다.
   * @param request
   * @returns false를 반환하면 ForbiddenException를 반환한다.
   */
  validate: (request: Request) => boolean;
}

export interface Strategy {
  readonly OAUTH2_URI: string;
  readonly isOauthCallback: (path: string) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
}

export type GuardVerify = (req: Request) => true;
