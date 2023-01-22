import { NotRequestKey, Request } from '@COMMON';
import { VerifyOptions } from 'jsonwebtoken';

export type JwtFromRequestFunction = (req: Request) => string | null;

export interface StrategyOptions<T extends string = 'user'> {
  /**
   * symmetric key or public key of asymmetric key
   */
  readonly secret: string | Buffer;
  /**
   * extract jwt from request, if a token not exist, return null.
   * @param req user's request context
   * @returns token or null
   */
  readonly jwtFromRequest: readonly JwtFromRequestFunction[];
  /**
   * jwt verify options
   */
  readonly verifyOptions?: Omit<VerifyOptions, 'complete'>;
  /**
   * request[key] refers to identity object.
   */
  readonly key: NotRequestKey<T>;
}
