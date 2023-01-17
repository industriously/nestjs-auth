import type { NotRequestKey, Credentials as DefaultCredentials } from '@COMMON';

export interface Oauth2Options {
  readonly client_id: string;
  readonly client_secret: string;
  readonly redirect_uri: string;
  readonly scope: string[];
  /**
   * 'online' (default) or 'offline' (gets refresh_token)
   */
  readonly access_type?: 'online' | 'offline';
  /**
   * Enable incremental authorization. Recommended as a best practice.
   */
  readonly include_granted_scopes?: boolean;
  /**
   * A space-delimited list of string values that specifies whether the authorization server prompts the user for reauthentication and consent. The possible values are:
   *
   * consent
   * The authorization server prompts the user for consent before returning information to the client.
   *
   * select_account
   * The authorization server prompts the user to select a user account. This allows a user who has multiple accounts at the authorization server to select amongst the multiple accounts that they may have current sessions for.
   *
   * If no value is specified and the user has not previously authorized access, then the user is shown a consent screen.
   */
  readonly prompt?: 'consent' | 'select_account';
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
