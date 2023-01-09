import { NotRequestKey } from './common.interface';

/**
 * oauth2 client option
 */
export interface GoogleOauth2ClientOptions {
  readonly client_id: string;
  readonly client_secret: string;
  readonly redirect_uri: string;
}

/**
 * 구글 로그인을 위해 필요한 모든 options
 */
export interface GoogleStrategyOptions<T = 'user'>
  extends GoogleOauth2ClientOptions {
  readonly scope: string[] | string;
  readonly key: NotRequestKey<T>;
}
