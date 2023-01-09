import { Request } from 'express';

export interface Strategy<T = unknown> {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  readonly isOauthCallback: (request: Request) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
  readonly getData: (request: Request) => T | undefined;
  readonly setData: (request: Request, data: T) => void;
  readonly validate: (request: Request) => boolean;
}

export type NotRequestKey<T> = T extends keyof Request ? never : T;
