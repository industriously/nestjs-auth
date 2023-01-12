import type { NotRequestKey } from './common.interface';

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
  readonly scope: string[];
  readonly key: NotRequestKey<T>;
}

namespace GoogleIdToken {
  interface Default {
    aud: string;
    exp: string;
    iat: string;
    iss: string;
    sub: string;
    at_hash?: string;
    azp?: string;
    hd?: string;
    picture?: string;
    profile?: string;
  }

  interface EmailClaim {
    email: string;
    email_verified: boolean;
  }
  interface NameClaim {
    family_name?: string;
    given_name?: string;
    locale?: string;
    name: string;
  }
  export type GoogleIdToken<Scope extends string> = Default &
    ('email' extends Scope ? EmailClaim : {}) &
    ('profile' extends Scope ? NameClaim : {});
}

export type GoogleIdToken<Scope extends 'email' | 'profile'> =
  GoogleIdToken.GoogleIdToken<Scope>;
