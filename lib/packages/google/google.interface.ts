import type { NotRequestKey, Credentials } from '../../common/common.interface';

export namespace Google {
  export interface Oauth2Options {
    readonly client_id: string;
    readonly client_secret: string;
    readonly redirect_uri: string;
    readonly scope: string[];
  }
  export interface StrategyOptions<T extends string = 'user'>
    extends Oauth2Options {
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
  export type IdToken<Scope extends 'email' | 'profile'> = IdTokenDefault &
    ('email' extends Scope ? IdTokenEmailClaim : {}) &
    ('profile' extends Scope ? IdTokenNameClaim : {});

  export interface Tokens extends Credentials {
    id_token: string;
  }
}
