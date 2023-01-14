import queryString from 'querystring';
import type { SDK } from '@COMMON/common.interface';
import type { Google } from './google.interface';

const OAUTH2_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const GoogleSDK: SDK<Google.Oauth2Options, Google.Tokens, string> = (
  options,
) => {
  const { client_id, client_secret, redirect_uri, scope } = options;
  return {
    oauth_uri:
      OAUTH2_URL +
      '?' +
      queryString.stringify({
        client_id,
        redirect_uri,
        scope: scope.join(' '),
        response_type: 'code',
      }),
    getCredentials(code) {
      throw Error();
    },
    query(target, token) {
      throw Error();
    },
    isSuccess<T>(data: unknown, statusCode: number): data is T {
      throw Error();
    },
  };
};
