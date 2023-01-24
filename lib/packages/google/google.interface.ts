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
  /**
   * The audience that this ID token is intended for. It must be one of the OAuth 2.0 client IDs of your application.
   */
  aud: string;
  /**
   * Expiration time on or after which the ID token must not be accepted. Represented in Unix time (integer seconds).
   */
  exp: number;
  /**
   * The time the ID token was issued. Represented in Unix time (integer seconds).
   */
  iat: number;
  /**
   * The Issuer Identifier for the Issuer of the response. Always https://accounts.google.com or accounts.google.com for Google ID tokens.
   */
  iss: string;
  /**
   * An identifier for the user, unique among all Google accounts and never reused. A Google account can have multiple email addresses at different points in time, but the sub value is never changed. Use sub within your application as the unique-identifier key for the user. Maximum length of 255 case-sensitive ASCII characters.
   */
  sub: string;
  /**
   * Access token hash. Provides validation that the access token is tied to the identity token. If the ID token is issued with an access_token value in the server flow, this claim is always included. This claim can be used as an alternate mechanism to protect against cross-site request forgery attacks, but if you follow Step 1 and Step 3 it is not necessary to verify the access token.
   */
  at_hash?: string;
  /**
   * The client_id of the authorized presenter. This claim is only needed when the party requesting the ID token is not the same as the audience of the ID token. This may be the case at Google for hybrid apps where a web application and Android app have a different OAuth 2.0 client_id but share the same Google APIs project.
   */
  azp?: string;
  /**
   * 	The domain associated with the Google Cloud organization of the user. Provided only if the user belongs to a Google Cloud organization.
   */
  hd?: string;
  /**
   * The URL of the user's profile picture. Might be provided when:
   *
   * * The request scope included the string "profile"
   *
   * * The ID token is returned from a token refresh
   *
   * When picture claims are present, you can use them to update your app's user records. Note that this claim is never guaranteed to be present.
   */
  picture?: string;
  /**
   * The URL of the user's profile page. Might be provided when:
   *
   * * The request scope included the string "profile"
   *
   * * The ID token is returned from a token refresh
   *
   * When profile claims are present, you can use them to update your app's user records. Note that this claim is never guaranteed to be present.
   */
  profile?: string;
}

interface IdTokenEmailClaim {
  /**
   * The user's email address. This value may not be unique to this user and is not suitable for use as a primary key. Provided only if your scope included the email scope value.
   */
  email: string;
  /**
   * True if the user's e-mail address has been verified; otherwise false.
   */
  email_verified: boolean;
}

interface IdTokenNameClaim {
  /**
   * The user's surname(s) or last name(s). Might be provided when a name claim is present.
   */
  family_name?: string;
  /**
   * The user's given name(s) or first name(s). Might be provided when a name claim is present.
   */
  given_name?: string;
  /**
   * The user's locale, represented by a BCP 47 language tag. Might be provided when a name claim is present.
   */
  locale?: string;
  /**
   * The user's full name, in a displayable form. Might be provided when:
   *
   * * The request scope included the string "profile"
   * * The ID token is returned from a token refresh
   *
   * When name claims are present, you can use them to update your app's user records. Note that this claim is never guaranteed to be present.
   */
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
