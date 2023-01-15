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

export interface Strategy<
  T = unknown,
  R = T,
  C extends Credentials = Credentials,
> {
  /**
   * oauth system authenticate uri
   */
  readonly OAUTH2_URI: string;
  /**
   * oauth callback uri, oauth system will redirect this uri with code
   */
  readonly redirect_uri: string;
  /**
   * check current path is redirect url
   * @param uri current path that user request
   * @returns true if current path is rediect url
   */
  readonly isRedirectURL: (path: string) => boolean;
  /**
   * get code from http request query
   * @param request user's http request
   * @returns code
   */
  readonly getCode: (request: Request) => string;
  /**
   * get user's credentials data
   * @param code authenticated user's code
   * @returns credentials obtained from oauth system using code
   */
  readonly authorize: (code: string) => Promise<C>;
  /**
   * get user's identity data
   * @param credentials the object have access_token, refresh_token...
   * @returns user identity obtained from oauth system using credentials
   */
  readonly getIdentity: (credentials: C) => Promise<T>;
  /**
   * save identity object
   * @param request user's http context request
   * @param identity transfromed identity
   * @returns
   */
  readonly saveIdentity: (request: Request, identity: R) => void;
  /**
   * transform user identity object
   * @param identity old identity object
   * @returns transformed identity object
   */
  readonly transform: (identity: T) => R;
  /**
   * validate user's identity is correct.
   * If you want to throw custom exception, you should throw your custom exception in this method.
   * @param identity user's transformed identity object
   * @param credentials user's tokens like access_token
   * @returns true if identity are correct
   */
  readonly validate: (identity: R, credentials: C) => boolean;
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
  readonly getCredentials: (code: string) => Promise<C | null>;
  readonly query: (target: T, token: string) => Promise<FetcherResponse>;
  readonly isSuccess: <D>(data: unknown, statusCode: number) => data is D;
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
