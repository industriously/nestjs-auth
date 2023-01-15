import { GithubSDK } from './sdk';
import { NotRequestKey, Credentials, SDK, BaseAbstractStrategy } from '@COMMON';
import type {
  Email,
  Oauth2Options,
  StrategyOptions,
  Target,
  User,
} from './github.interface';

export abstract class AbstractStrategy<
  K extends string = 'user',
  T = User,
> extends BaseAbstractStrategy<K, User, T, Credentials> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  protected readonly key: NotRequestKey<K>;
  private readonly sdk: ReturnType<SDK<Oauth2Options, Credentials, Target>>;
  constructor(options: StrategyOptions<K>) {
    super();
    this.key = options.key;
    this.redirect_uri = options.redirect_uri;
    this.sdk = GithubSDK(options);
    this.OAUTH2_URI = this.sdk.oauth_uri;
  }

  async authorize(code: string): Promise<Credentials> {
    const credentials = await this.sdk.getCredentials(code);
    return credentials ? credentials : this.throw();
  }

  async getIdentity(credentials: Credentials): Promise<User> {
    const { access_token } = credentials;
    const { data: user, statusCode } = await this.sdk.query(
      'user',
      access_token,
    );

    if (!this.sdk.isSuccess<User>(user, statusCode)) {
      this.throw();
    }
    if (user.email == null) {
      const { data, statusCode } = await this.sdk.query(
        'user_emails',
        access_token,
      );
      if (this.sdk.isSuccess<Email[]>(data, statusCode)) {
        user.email =
          data.find(({ primary, verified }) => primary && verified)?.email ??
          null;
      }
    }
    return user;
  }

  abstract transform(identity: User): T;
  abstract validate(identity: T, credentials: Credentials): boolean;
}
