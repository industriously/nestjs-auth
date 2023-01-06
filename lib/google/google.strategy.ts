import { Strategy } from '@INTERFACE/common.interface';
import { GoogleOauth2Options } from '@INTERFACE/google.interface';
import { get_client, get_credentials, get_oauth2_uri } from './api';

export const GoogleStrategy = (options: GoogleOauth2Options): Strategy => {
  const client = get_client(options);
  return {
    OAUTH2_URI: get_oauth2_uri(client)(options),
    isOauthCallback(path) {
      return path === options.redirect_uri;
    },
    async authorize(request) {
      const code = request.query.code;
      if (typeof code !== 'string') {
        return;
      }
      const { id_token } = await get_credentials(client)(code);
      (request as any).user = id_token;
      return;
    },
  };
};
