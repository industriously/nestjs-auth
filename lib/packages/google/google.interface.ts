import type { NotRequestKey, Credentials as DefaultCredentials } from '@COMMON';

export interface Oauth2Options {
  readonly client_id: string;
  readonly client_secret: string;
  readonly redirect_uri: string;
  readonly scope: string[];
  // 'online' (default) or 'offline' (gets refresh_token)
  readonly access_type?: 'online' | 'offline';
  // Enable incremental authorization. Recommended as a best practice.
  readonly include_granted_scopes?: boolean;
}
export interface StrategyOptions<T extends string = 'user'>
  extends Oauth2Options {
  /**
   * request[key] refers to identity object.
   */
  readonly key: NotRequestKey<T>;
}

interface IdTokenDefault {
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

interface IdTokenEmailClaim {
  email: string;
  email_verified: boolean;
}

interface IdTokenNameClaim {
  family_name?: string;
  given_name?: string;
  locale?: string;
  name: string;
}

/**
 * Scope mean options's scope.
 * If you write "profile", this type have keys related "profile" oauth scope.
 */
export type IdToken<Scope extends 'email' | 'profile' | '' = ''> =
  IdTokenDefault &
    ('email' extends Scope ? IdTokenEmailClaim : {}) &
    ('profile' extends Scope ? IdTokenNameClaim : {});

/**
 * id_token's payload include user's profile.
 * If you don't know id_token, search OIDC Protocol.
 */
export interface Credentials extends DefaultCredentials {
  id_token: string;
}
