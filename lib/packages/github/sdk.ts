import queryString from 'querystring';
import axios from 'axios';
import type { Github } from './github.interface';
import type { Credentials, SDK } from '@COMMON/common.interface';

const OAUTH2_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const API_BASE = 'https://api.github.com';
const API_USER_PATH = '/user';
const API_USER_EMAILS_PATH = '/user/emails';

interface AccessToken {
  access_token: string;
  token_type: string;
  scope: string;
}

interface AccessTokenWithExpires extends AccessToken {
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

const uri_mapper: Record<Github.Target, string> = {
  user: API_BASE + API_USER_PATH,
  user_emails: API_BASE + API_USER_EMAILS_PATH + '?per_page=100',
};

export const GithubSDK: SDK<
  Github.Oauth2Options,
  Credentials,
  Github.Target
> = (options) => {
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
      const { data } = await axios.post<AccessToken | AccessTokenWithExpires>(
        ACCESS_TOKEN_URL,
        { client_id, client_secret, code },
        { headers: { Accept: 'application/json' } },
      );
      const { access_token, token_type } = data;
      return {
        access_token,
        token_type,
        ...('expires_in' in data
          ? {
              access_token_expires_in: data.expires_in + '',
              refresh_token_expires_in: data.refresh_token_expires_in + '',
              refresh_token: data.refresh_token,
            }
          : {}),
      };
    },
    async query<D = unknown>(target: Github.Target, token: string) {
      const headers = {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-Github-Api-Version': '2022-11-28',
      };
      const { data } = await axios.get<D>(uri_mapper[target], { headers });
      return data;
    },
  };
};

/** 
    if (data.email == null) {
      data.email =
        emails?.data.find(({ primary, verified }) => primary && verified)
          ?.email ?? null;
    }

    return data;
  };
*/
