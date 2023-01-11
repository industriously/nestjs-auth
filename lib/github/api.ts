import queryString from 'querystring';
import axios from 'axios';
import type {
  GithubOauth2Options,
  GithubPublicUser,
  GithubPrivateUser,
  GIthubEmail,
} from '@INTERFACE/github.interface';

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

type GetAccessToken = (code: string) => Promise<string>;

export const get_access_token =
  ({ client_id, client_secret }: GithubOauth2Options): GetAccessToken =>
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

export const get_profile = async (
  token: string,
): Promise<GithubPublicUser | GithubPrivateUser> => {
  const headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-Github-Api-Version': '2022-11-28',
  };
  const [{ data }, { data: emails }] = await Promise.all([
    axios.get<GithubPublicUser | GithubPrivateUser>(USER_URL, { headers }),
    axios.get<GIthubEmail[]>(USER_EMAILS_URL + '?per_page=100', { headers }),
  ]);

  if (data.email == null) {
    data.email =
      emails.find(({ primary, verified }) => primary && verified)?.email ??
      null;
  }

  return data;
};
