import type * as Express from 'express';

interface Query {
  [key: string]: string | string[] | Query | Query[];
}

export type Request = Express.Request<
  { [key: string]: string },
  object,
  object,
  Query,
  Record<string, unknown>
>;

export type Response = Express.Response<object, Record<string, unknown>>;

export interface Strategy<T = unknown> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  readonly isOauthCallback: (request: Request) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
  readonly getData: (request: Request) => T | undefined;
  readonly setData: <R>(request: Request, data: T | R) => void;
  readonly validate: (request: Request) => boolean;
}

export interface Credentials {
  readonly token_type: string;
  readonly access_token: string;
  readonly refresh_token: string;
  /**
   * numeric string (sec)
   */
  readonly access_token_expires_in: string;
  /**
   * numeric string (sec)
   */
  readonly refresh_token_expires_in: string;
}

export type NotRequestKey<T> = T extends keyof Express.Request
  ? T extends 'user'
    ? 'user'
    : never
  : T;
