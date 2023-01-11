import {
  Credentials,
  GenerateAuthUrlOpts,
  OAuth2Client,
} from 'google-auth-library';
import type { GoogleOauth2ClientOptions } from '@INTERFACE/google.interface';

export const get_client = ({
  client_id,
  client_secret,
  redirect_uri,
}: GoogleOauth2ClientOptions) =>
  new OAuth2Client(client_id, client_secret, redirect_uri);

type GetOauthUrl = (options: GenerateAuthUrlOpts) => string;

export const get_oauth2_uri =
  (client: OAuth2Client): GetOauthUrl =>
  ({ client_id, redirect_uri, scope }) =>
    client.generateAuthUrl({ client_id, redirect_uri, scope });

type GetCredentials = (code: string) => Promise<Credentials>;

export const get_credentials =
  (client: OAuth2Client): GetCredentials =>
  async (code) => {
    const { tokens } = await client.getToken(code);
    return tokens;
  };
