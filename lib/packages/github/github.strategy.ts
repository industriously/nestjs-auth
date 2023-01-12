import {
  get_oauth2_uri,
  get_access_token,
  GetAccessToken,
  get_user,
  GetUser,
} from './api';
import type {
  NotRequestKey,
  Request,
  Strategy,
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
  private readonly getAccessToken: GetAccessToken;
  private readonly getUser: GetUser;
  constructor(options: Github.StrategyOptions<K>) {
    const { redirect_uri, key, scope } = options;
    this.OAUTH2_URI = get_oauth2_uri(options);
    this.getAccessToken = get_access_token(options);
    this.getUser = get_user(scope);
    this.redirect_uri = redirect_uri;
    this.key = key;
  }
  isOauthCallback(request: Request): boolean {
    return new URL(this.redirect_uri).pathname === request.path;
  }
  async authorize(request: Request): Promise<void> {
    const code = request.query.code as string;
    const access_token = await this.getAccessToken(code);
    const user = await this.getUser(access_token);
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
