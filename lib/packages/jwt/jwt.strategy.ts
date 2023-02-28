import { BaseAbstractStrategy, Request } from '@COMMON';
import { isString } from '@LIB/utils';
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
  override getCode(request: Request): string {
    for (const extractor of this.options.jwtFromRequest) {
      const jwt = extractor(request);
      if (isString(jwt)) {
        return jwt;
      }
    }
    this.throw({ message: 'Can not find jwt.' });
  }
  override isRedirectURL(_: string): boolean {
    return true;
  }
  async authorize(token: string): Promise<T> {
    return verify(token, this.options.secret, {
      ...(this.options.verifyOptions ? this.options.verifyOptions : {}),
      complete: false,
    }) as T;
  }
  async getIdentity(payload: T): Promise<T> {
    return payload;
  }
  abstract override validate(payload: T): boolean;
  abstract override transform(payload: T): R;
}
