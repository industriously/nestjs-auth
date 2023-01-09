import { Request } from 'express';

export interface Strategy {
  readonly OAUTH2_URI: string;
  readonly redirect_uri: string;
  readonly isOauthCallback: (request: Request) => boolean;
  readonly authorize: (request: Request) => Promise<void>;
  readonly validate: (request: Request) => boolean;
}
