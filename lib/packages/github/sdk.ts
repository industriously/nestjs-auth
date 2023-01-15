import queryString from 'querystring';
import { fetcher } from '@UTILS';
import type { Oauth2Options, Target } from './github.interface';
import type { Credentials, SDK } from '@COMMON';

const OAUTH2_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const API_BASE = 'https://api.github.com';
const API_USER_PATH = '/user';
const API_USER_EMAILS_PATH = '/user/emails';

interface Tokens {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

const uri_mapper: Record<Target, string> = {
  user: API_BASE + API_USER_PATH,
  user_emails: API_BASE + API_USER_EMAILS_PATH,
};

export const GithubSDK: SDK<Oauth2Options, Credentials, Target> = (options) => {
  const {
    client_id,
    client_secret,
    redirect_uri,
    scope,
    allow_signup = true,
  } = options;
  return {
    oauth_uri:
      OAUTH2_URL +
      '?' +
      queryString.stringify({
        client_id,
        redirect_uri,
        allow_signup,
        scope: scope.join(' '),
      }),
    async getCredentials(code) {
      const { data, statusCode } = await fetcher.post(
        ACCESS_TOKEN_URL,
        { client_id, client_secret, code },
        { Accept: 'application/json' },
      );
      if (!this.isSuccess<Tokens>(data, statusCode)) {
        throw new Error('Can not get credentials');
      }
      const {
        access_token,
        expires_in,
        token_type,
        refresh_token,
        refresh_token_expires_in,
      } = data;
      return {
        token_type,
        access_token,
        access_token_expires_in: expires_in,
        refresh_token,
        refresh_token_expires_in,
      };
    },
    query(target: Target, token: string) {
      const headers = {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-Github-Api-Version': '2022-11-28',
      };
      return fetcher.get(uri_mapper[target], headers);
    },
    isSuccess<T>(_: unknown, statusCode: number): _ is T {
      // OK || Not Modified
      return statusCode === 200 || statusCode === 304;
    },
  };
};
