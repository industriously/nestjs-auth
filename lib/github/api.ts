import queryString from 'querystring';
import axios from 'axios';
import type { Github } from '@INTERFACE/github.interface';

const OAUTH2_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_URL = 'https://api.github.com/user';
const USER_EMAILS_URL = 'https://api.github.com/user/emails';

export const get_oauth2_uri = ({
  client_id,
  redirect_uri,
  scope,
  allow_signup = true,
}: Github.Oauth2Options) =>
  OAUTH2_URL +
  '?' +
  queryString.stringify({
    client_id,
    redirect_uri,
    allow_signup,
    scope: scope.join(' '),
  });

export type GetAccessToken = (code: string) => Promise<string>;

export const get_access_token =
  ({ client_id, client_secret }: Github.Oauth2Options): GetAccessToken =>
  async (code) => {
    const {
      data: { access_token },
    } = await axios.post<{
      access_token: string;
      scope: string;
      token_type: string;
    }>(
      ACCESS_TOKEN_URL,
      {
        code,
        client_id,
        client_secret,
      },
      { headers: { Accept: 'application/json' } },
    );
    return access_token;
  };

export type GetUser = (token: string) => Promise<Github.User>;

export const get_user =
  (scope: Github.Scope[]): GetUser =>
  async (token) => {
    const headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-Github-Api-Version': '2022-11-28',
    };
    const [{ data }, emails] = await Promise.all([
      axios.get<Github.User>(USER_URL, { headers }),
      scope.some((item) => item === 'user:email')
        ? axios.get<Github.Email[]>(USER_EMAILS_URL + '?per_page=100', {
            headers,
          })
        : null,
    ]);

    if (data.email == null) {
      data.email =
        emails?.data.find(({ primary, verified }) => primary && verified)
          ?.email ?? null;
    }

    return data;
  };
