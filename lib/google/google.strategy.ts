import { Strategy } from '@INTERFACE/common.interface';
import { GoogleStrategyOptions } from '@INTERFACE/google.interface';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Credentials } from 'google-auth-library';
import { decode_jwt } from '@LIB/util';
import { get_client, get_credentials, get_oauth2_uri } from './api';

@Injectable()
export class GoogleStrategy implements Strategy {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  protected readonly getCredentials: (code: string) => Promise<Credentials>;

  constructor(options: GoogleStrategyOptions) {
    const client = get_client(options);
    this.redirect_uri = options.redirect_uri;
    this.OAUTH2_URI = get_oauth2_uri(client)(options);
    this.getCredentials = get_credentials(client);
  }

  isOauthCallback(request: Request) {
    const { pathname } = new URL(this.redirect_uri);
    return request.route.path === pathname;
  }

  async authorize(request: Request): Promise<void> {
    const code = request.query.code;
    if (typeof code !== 'string') {
      return;
    }
    const { id_token } = await this.getCredentials(code);
    (request as any).user = decode_jwt(id_token as string);
    return;
  }

  validate(request: Request): boolean {
    return true;
  }
}
