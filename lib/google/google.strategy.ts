import { decode_jwt } from '@LIB/util';
import { get_client, get_credentials, get_oauth2_uri } from './api';
import type { Credentials } from 'google-auth-library';
import type { NotRequestKey, Strategy } from '@INTERFACE/common.interface';
import type { GoogleStrategyOptions } from '@INTERFACE/google.interface';
import type { Request } from 'express';

export abstract class AbstractGoogleStrategy<K = 'user', T = unknown>
  implements Strategy<T>
{
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

  setData(request: Request, data: T): void {
    (request as any)[this.key] = data;
    return;
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
    const data = decode_jwt<T>(id_token as string);
    if (data) {
      this.setData(request, data);
    }
    return;
  }

  abstract validate(request: Request): boolean;
}
