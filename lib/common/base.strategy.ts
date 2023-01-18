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
  C extends Credentials = Credentials,
> implements Strategy<T, R, C>
{
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
    if (typeof code !== 'string') {
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
  protected abstract key: NotRequestKey<K>;
  abstract OAUTH2_URI: string;
  abstract redirect_uri: string;
  abstract authorize(code: string): Promise<C>;
  abstract getIdentity(credentials: C): Promise<T>;
  abstract transform(identity: T): R;
  abstract validate(identity: R, credentials: C): boolean;
}
