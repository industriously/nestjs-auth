import { Strategy } from '@INTERFACE/common.interface';
import { GoogleOauth2Options } from '@INTERFACE/google.interface';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Credentials } from 'google-auth-library';
import { decode_jwt } from 'lib/util';
import { get_client, get_credentials, get_oauth2_uri } from './api';

@Injectable()
export class GoogleStrategy implements Strategy {
  readonly OAUTH2_URI: string;
  private readonly getCredentials: (code: string) => Promise<Credentials>;

  constructor(private readonly options: GoogleOauth2Options) {
    const client = get_client(this.options);
    this.OAUTH2_URI = get_oauth2_uri(client)(options);
    this.getCredentials = get_credentials(client);
  }

  isOauthCallback(path: string) {
    return path === this.options.redirect_uri;
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
}
