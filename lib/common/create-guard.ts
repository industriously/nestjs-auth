import { IAuthGuard } from '@INTERFACE/common.interface';
import { Strategy } from '@INTERFACE/common.interface';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements IAuthGuard {
  constructor(private readonly strategy: Strategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const path: string = request.route.path;

    this.strategy.isOauthCallback(path)
      ? await this.strategy.authorize(request)
      : response.redirect(this.strategy.OAUTH2_URI);

    return this.validate(request);
  }

  validate(request: Request) {
    return true;
  }
}
