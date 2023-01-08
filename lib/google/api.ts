import { GoogleOauth2ClientOptions } from '@INTERFACE/google.interface';
import {
  Credentials,
  GenerateAuthUrlOpts,
  OAuth2Client,
} from 'google-auth-library';

export const get_client = ({
  client_id,
  client_secret,
  redirect_uri,
}: GoogleOauth2ClientOptions) =>
  new OAuth2Client(client_id, client_secret, redirect_uri);

export const get_oauth2_uri =
  (client: OAuth2Client) =>
  ({ client_id, redirect_uri, scope }: GenerateAuthUrlOpts) =>
    client.generateAuthUrl({ client_id, redirect_uri, scope });

export const get_credentials =
  (client: OAuth2Client) =>
  async (code: string): Promise<Credentials> => {
    const { tokens } = await client.getToken(code);
    return tokens;
  };
