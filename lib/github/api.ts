import queryString from 'querystring';
import { GithubOauth2Options } from '@LIB/interface/github.interface';
import axios from 'axios';

const OAUTH2_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_URL = 'https://github.com/user';
const USER_EMAILS_URL = 'https://github.com/user/emails';

export const get_oauth2_uri = ({
  client_id,
  redirect_uri,
  scope,
  allow_signup = true,
}: GithubOauth2Options) =>
  OAUTH2_URL +
  '?' +
  queryString.stringify({
    client_id,
    redirect_uri,
    allow_signup,
    scope: scope.join(' '),
  });

export const get_access_token =
  ({ client_id, client_secret }: GithubOauth2Options) =>
  (code: string): Promise<string | null> =>
    axios
      .post<{
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
      )
      .then(({ data: { access_token } }) => access_token)
      .catch(() => null);

export const get_profile = (token: string) => {
  const headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-Github-Api-Version': '2022-11-28',
  };
  Promise.all([
    axios.get(USER_URL, { headers }),
    axios.get(USER_EMAILS_URL, { headers }),
  ]).then(([{ data: data1 }, { data: data2 }]) => {});
};

interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  name?: string;
  email?: string;
}
