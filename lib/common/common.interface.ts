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
  readonly refresh_token?: string;
  /**
   * numeric string (sec)
   */
  readonly access_token_expires_in?: number;
  /**
   * numeric string (sec)
   */
  readonly refresh_token_expires_in?: number;
}

export type NotRequestKey<T> = T extends keyof Express.Request
  ? T extends 'user'
    ? 'user'
    : never
  : T;

export type SDK<
  O extends object = {},
  C extends Credentials = Credentials,
  T extends string = string,
> = (options: O) => {
  readonly oauth_uri: string;
  readonly getCredentials: (code: string) => Promise<C>;
  readonly query: (target: T, token: string) => Promise<FetcherResponse>;
  readonly isSuccess: <T>(data: unknown, statusCode: number) => data is T;
};

export interface FetcherResponse<T = unknown> {
  /**
   * http statusCode ex) 200, 401...
   */
  statusCode: number;
  /**
   * http response body
   */
  data: T;
}
