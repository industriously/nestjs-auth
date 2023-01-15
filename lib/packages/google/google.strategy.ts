import { decode_jwt } from '@LIB/utils';
import { GoogleSDK } from './sdk';
import type { NotRequestKey, Request, SDK, Strategy } from '@COMMON';
import type {
  Credentials,
  Oauth2Options,
  StrategyOptions,
} from './google.interface';

export abstract class AbstractStrategy<K extends string = 'user', T = unknown>
  implements Strategy<T>
{
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  private readonly key: NotRequestKey<K>;
  private readonly sdk: ReturnType<SDK<Oauth2Options, Credentials>>;
  constructor(options: StrategyOptions<K>) {
    this.redirect_uri = options.redirect_uri;
    this.key = options.key;
    this.sdk = GoogleSDK(options);
    this.OAUTH2_URI = this.sdk.oauth_uri;
  }

  getData(request: Request): T | undefined {
    return (request as any)[this.key];
  }

  setData<R>(request: Request, data: T | R): void {
    (request as any)[this.key] = data;
    return;
  }

  isOauthCallback(request: Request) {
    return new URL(this.redirect_uri).pathname === request.path;
  }

  async authorize(request: Request): Promise<void> {
    const code = request.query.code;
    if (typeof code !== 'string') {
      return;
    }
    const { id_token } = await this.sdk.getCredentials(code);
    const data = decode_jwt<T>(id_token as string);
    if (data) {
      this.setData(request, data);
    }
    return;
  }

  abstract validate(request: Request): boolean;
}
