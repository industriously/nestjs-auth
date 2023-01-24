import { decode_jwt } from '@UTILS';
import { GoogleSDK } from './sdk';
import { BaseAbstractStrategy, SDK } from '@COMMON';
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
  public readonly OAUTH2_URI: string;
  private readonly sdk: ReturnType<SDK<Oauth2Options, Credentials>>;
  constructor(options: StrategyOptions<K>) {
    super(options.key, options.redirect_uri);
    this.sdk = GoogleSDK(options);
    this.OAUTH2_URI = this.sdk.oauth_uri;
  }

  async authorize(code: string): Promise<Credentials> {
    const credentials = await this.sdk.getCredentials(code);
    return credentials
      ? credentials
      : this.throw({ message: 'Fail to access User Credentials.' });
  }

  async getIdentity(credentials: Credentials): Promise<IdToken<Scope>> {
    const { id_token } = credentials;
    const data = decode_jwt<IdToken<Scope>>(id_token);
    if (data == null) {
      this.throw({ statusCode: 401, message: 'Fail to access User Identity.' });
    }
    return data;
  }
}
