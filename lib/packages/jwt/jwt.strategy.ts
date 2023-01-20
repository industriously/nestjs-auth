import { BaseAbstractStrategy, Request } from '@COMMON';
import { verify } from 'jsonwebtoken';
import { StrategyOptions } from './jwt.interface';

export abstract class AbstractStrategy<
  K extends string = 'user',
  T = unknown,
  R = T,
> extends BaseAbstractStrategy<K, T, R, T> {
  public readonly OAUTH2_URI = '';
  constructor(private readonly options: StrategyOptions<K>) {
    super(options.key, '');
  }
  getCode(request: Request): string {
    return (
      this.options.jwtFromRequest(request) ??
      this.throw({ message: 'Can not find jwt.' })
    );
  }
  isRedirectURL(_: string): boolean {
    return true;
  }
  async authorize(token: string): Promise<T> {
    return verify(token, this.options.secret, {
      ...this.options.verifyOptions,
      complete: false,
    }) as T;
  }
  async getIdentity(payload: T): Promise<T> {
    return payload;
  }
  abstract transform(payload: T): R;
  abstract validate(payload: R): boolean;
}
