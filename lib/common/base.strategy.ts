import { isString } from '@LIB/utils';
import { AuthException } from './auth-exception';
import {
  Credentials,
  NotRequestKey,
  Strategy,
  Request,
  StrategyException,
} from './common.interface';

/**
 * This abstract class is implement general methods.
 */
export abstract class BaseAbstractStrategy<
  K extends string,
  T = unknown,
  R = T,
  C = Credentials,
> implements Strategy<T, R, C>
{
  constructor(
    private readonly key: NotRequestKey<K>,
    /**
     * oauth callback uri, oauth system will redirect this uri with code
     */
    private readonly redirect_uri: string,
  ) {}
  /**
   * this method will be called when strategy have exception.
   */
  protected throw({
    statusCode = 401,
    message = '',
  }: StrategyException): never {
    throw new AuthException(statusCode, message);
  }

  getCode(request: Request) {
    const code = request.query.code;
    if (!isString(code)) {
      this.throw({ message: 'Fail to authenticate' });
    }
    return code;
  }
  isRedirectURL(path: string) {
    return new URL(this.redirect_uri).pathname === path;
  }
  saveIdentity(request: Request, identity: R) {
    (request as any)[this.key] = identity;
    return;
  }
  abstract readonly OAUTH2_URI: string;
  abstract authorize(code: string): Promise<C>;
  abstract getIdentity(credentials: C): Promise<T>;
  abstract validate(identity: T, credentials: C): boolean;
  abstract transform(identity: T): R;
}
