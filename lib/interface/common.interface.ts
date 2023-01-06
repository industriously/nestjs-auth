import { Request } from 'express';

export interface Strategy {
  readonly OAUTH2_URI: string;
  readonly isOauthCallback: (path: string) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
}
