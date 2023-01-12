import { OAuth2Client } from 'google-auth-library';
import type { Google } from '@LIB/packages/google/google.interface';

export const get_client = ({
  client_id,
  client_secret,
  redirect_uri,
}: Google.Oauth2Options) =>
  new OAuth2Client(client_id, client_secret, redirect_uri);

type GetOauthUrl = (options: Google.Oauth2Options) => string;

export const get_oauth2_uri =
  (client: OAuth2Client): GetOauthUrl =>
  ({ client_id, redirect_uri, scope }) =>
    client.generateAuthUrl({ client_id, redirect_uri, scope });

type GetCredentials = (code: string) => Promise<Google.Tokens>;

export const get_credentials =
  (client: OAuth2Client): GetCredentials =>
  async (code) => {
    const { tokens } = await client.getToken(code);
    const {
      access_token = '',
      refresh_token = '',
      id_token = '',
      token_type = '',
      expiry_date = 0,
    } = tokens;
    const expires_in = (expiry_date ?? 0) / 1000;
    return {
      access_token: access_token ?? '',
      refresh_token: refresh_token ?? '',
      id_token: id_token ?? '',
      token_type: token_type ?? '',
      access_token_expires_in: expires_in.toString(),
      refresh_token_expires_in: expires_in.toString(),
    };
  };
