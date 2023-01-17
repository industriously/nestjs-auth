import queryString from 'querystring';
import { fetcher } from '@LIB/utils';
import type { SDK } from '@COMMON';
import type { Credentials, Oauth2Options } from './google.interface';

const OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKENS_URL = 'https://oauth2.googleapis.com/token';

interface GoogleCredentials {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  id_token: string;
  scope: string;
  token_type: 'Bearer';
}
export const GoogleSDK: SDK<Oauth2Options, Credentials, string> = (options) => {
  const {
    client_id,
    client_secret,
    redirect_uri,
    scope,
    access_type = 'online',
    include_granted_scopes = true,
    prompt,
  } = options;
  const scope_string = scope.join(' ') + ' openid';
  return {
    oauth_uri:
      OAUTH2_URL +
      '?' +
      queryString.stringify({
        client_id,
        redirect_uri,
        scope: scope_string,
        response_type: 'code',
        access_type,
        include_granted_scopes,
        ...(prompt ? { prompt } : {}),
      }),
    async getCredentials(code) {
      const body = {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      };
      const { data, statusCode } = await fetcher.post(
        TOKENS_URL,
        queryString.stringify(body),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      );
      if (!this.isSuccess<GoogleCredentials>(data, statusCode)) {
        return null;
      }
      const { access_token, expires_in, refresh_token, id_token, token_type } =
        data;
      return {
        access_token,
        access_token_expires_in: expires_in,
        refresh_token,
        id_token,
        token_type,
      };
    },
    query(target, token) {
      throw Error('Function is not implemented.');
    },
    isSuccess<T>(data: unknown, statusCode: number): data is T {
      return statusCode === 200 || statusCode === 304;
    },
  };
};
