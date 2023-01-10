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

export const get_oauth2_uri =
  (client: OAuth2Client) =>
  ({ client_id, redirect_uri, scope }: GenerateAuthUrlOpts) =>
    client.generateAuthUrl({ client_id, redirect_uri, scope });

export const get_credentials =
  (client: OAuth2Client) =>
  (code: string): Promise<Credentials> =>
    client.getToken(code).then(({ tokens }) => tokens);
