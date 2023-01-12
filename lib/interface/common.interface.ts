import type { Request } from 'express';

export interface Strategy<T = unknown> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  readonly isOauthCallback: (request: Request) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
  readonly getData: (request: Request) => T | undefined;
  readonly setData: <R>(request: Request, data: T | R) => void;
  readonly validate: (request: Request) => boolean;
}

export type NotRequestKey<T> = T extends keyof Request
  ? T extends 'user'
    ? 'user'
    : never
  : T;
