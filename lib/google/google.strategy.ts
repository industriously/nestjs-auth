import { NotRequestKey, Strategy } from '@INTERFACE/common.interface';
import { GoogleStrategyOptions } from '@INTERFACE/google.interface';
import { Request } from 'express';
import { Credentials } from 'google-auth-library';
import { decode_jwt } from '@LIB/util';
import { get_client, get_credentials, get_oauth2_uri } from './api';

export abstract class AbstractGoogleStrategy<K, T> implements Strategy<T> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  protected readonly getCredentials: (code: string) => Promise<Credentials>;
  private readonly key: NotRequestKey<K>;

  constructor(options: GoogleStrategyOptions<K>) {
    const client = get_client(options);
    this.redirect_uri = options.redirect_uri;
    this.OAUTH2_URI = get_oauth2_uri(client)(options);
    this.getCredentials = get_credentials(client);
    this.key = options.key;
  }

  getData(request: Request): T | undefined {
    return (request as any)[this.key];
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
    (request as any)[this.key] = decode_jwt(id_token as string);
    return;
  }

  abstract validate(data: T | undefined): boolean;
}
