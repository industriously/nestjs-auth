import { get_oauth2_uri } from './api';
import type { GithubStrategyOptions } from '@INTERFACE/github.interface';
import type { Request } from 'express';
import type { NotRequestKey, Strategy } from '@INTERFACE/common.interface';

export abstract class AbstractGithubStrategy<K, T> implements Strategy<T> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  private readonly key: NotRequestKey<K>;
  constructor(options: GithubStrategyOptions<K>) {
    this.OAUTH2_URI = get_oauth2_uri(options);
    this.redirect_uri = options.redirect_uri;
    this.key = options.key;
  }
  isOauthCallback(request: Request): boolean {
    const { pathname } = new URL(this.redirect_uri);
    return request.route.path === pathname;
  }
  async authorize(request: Request): Promise<void> {
    const code = request.query.code as string;
  }
  getData(request: Request): T | undefined {
    return (request as any)[this.key];
  }
  setData<R>(request: Request, data: T | R): void {
    return (request as any)[this.key];
  }
  abstract validate: (request: Request) => boolean;
}
