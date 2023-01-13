import { GithubSDK } from './sdk';
import type {
  NotRequestKey,
  Request,
  Strategy,
  Credentials,
  SDK,
} from '@COMMON/common.interface';
import type { Github } from './github.interface';

export abstract class AbstractGithubStrategy<
  K extends string = 'user',
  T = unknown,
> implements Strategy<T>
{
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  private readonly key: NotRequestKey<K>;
  private readonly sdk: ReturnType<
    SDK<Github.Oauth2Options, Credentials, Github.Target>
  >;
  constructor(options: Github.StrategyOptions<K>) {
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
    const user = await this.sdk.query<Github.User>('user', access_token);
    const emails = await this.sdk.query<Github.Email[]>(
      'user_emails',
      access_token,
    );
    this.setData(request, user);
    return;
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
