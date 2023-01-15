import { decode_jwt } from '@LIB/utils';
import { GoogleSDK } from './sdk';
import { BaseAbstractStrategy, NotRequestKey, Request, SDK } from '@COMMON';
import type {
  Credentials,
  IdToken,
  Oauth2Options,
  StrategyOptions,
} from './google.interface';

export abstract class AbstractStrategy<
  K extends string = 'user',
  Scope extends '' | 'email' | 'profile' = '',
  T = IdToken<Scope>,
> extends BaseAbstractStrategy<K, IdToken<Scope>, T, Credentials> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  protected readonly key: NotRequestKey<K>;
  private readonly sdk: ReturnType<SDK<Oauth2Options, Credentials>>;
  constructor(options: StrategyOptions<K>) {
    super();
    this.key = options.key;
    this.redirect_uri = options.redirect_uri;
    this.sdk = GoogleSDK(options);
    this.OAUTH2_URI = this.sdk.oauth_uri;
  }

  async authorize(code: string): Promise<Credentials> {
    const credentials = await this.sdk.getCredentials(code);
    return credentials ? credentials : this.throw();
  }

  async getIdentity(credentials: Credentials): Promise<IdToken<Scope>> {
    const { id_token } = credentials;
    const data = decode_jwt<IdToken<Scope>>(id_token);
    if (data == null) {
      this.throw();
    }
    return data;
  }

  abstract transform(identity: IdToken<Scope>): T;
  abstract validate(identity: T, credentials: Credentials): boolean;
}
