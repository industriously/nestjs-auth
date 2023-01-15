import { GithubSDK } from './sdk';
import type {
  NotRequestKey,
  Request,
  Strategy,
  Credentials,
  SDK,
} from '@COMMON/common.interface';
import type {
  Email,
  Oauth2Options,
  StrategyOptions,
  Target,
  User,
} from './github.interface';

export abstract class AbstractGithubStrategy<
  K extends string = 'user',
  T = unknown,
> implements Strategy<T>
{
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  private readonly key: NotRequestKey<K>;
  private readonly sdk: ReturnType<SDK<Oauth2Options, Credentials, Target>>;
  constructor(options: StrategyOptions<K>) {
    const { redirect_uri, key } = options;
    this.redirect_uri = redirect_uri;
    this.key = key;
    this.sdk = GithubSDK(options);
    this.OAUTH2_URI = this.sdk.oauth_uri;
  }
  isOauthCallback(request: Request): boolean {
    return new URL(this.redirect_uri).pathname === request.path;
  }
  async authorize(request: Request): Promise<void> {
    const code = request.query.code as string;
    const { access_token } = await this.sdk.getCredentials(code);
    const { data: user, statusCode } = await this.sdk.query(
      'user',
      access_token,
    );
    if (!this.sdk.isSuccess<User>(user, statusCode)) {
      return;
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
    this.setData(request, user);
  }
  getData(request: Request): T | undefined {
    return (request as any)[this.key];
  }
  setData<R>(request: Request, data: T | R): void {
    (request as any)[this.key] = data;
    return;
  }
  abstract validate(request: Request): boolean;
}
