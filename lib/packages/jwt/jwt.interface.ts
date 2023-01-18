import { NotRequestKey, Request } from '@COMMON';
import { VerifyOptions } from 'jsonwebtoken';

export type JwtFromRequestFunction = (req: Request) => string | null;

export interface StrategyOptions<T extends string = 'user'> {
  /**
   * symmetric key or public key of asymmetric key
   */
  secret: string | Buffer;
  /**
   * extract jwt from request, if a token not exist, return null.
   * @param req user's request context
   * @returns token or null
   */
  jwtFromRequest: (req: Request) => string | null;
  /**
   * jwt verify options
   */
  verifyOptions: VerifyOptions;
  /**
   * request[key] refers to identity object.
   */
  key: NotRequestKey<T>;
}
