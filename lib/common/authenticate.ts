import type { Strategy, Request } from '@COMMON';

interface OAUTH2 {
  type: 'OAUTH2';
  redirect_url: string;
}

interface Callback {
  type: 'Callback';
  isSuccess: boolean;
}

type AuthenticateReturn = OAUTH2 | Callback;

export const authenticate =
  (strategy: Strategy) =>
  async (req: Request): Promise<AuthenticateReturn> => {
    if (strategy.isRedirectURL(req.path)) {
      const credentials = await strategy.authorize(strategy.getCode(req));
      const identity = strategy.transform(
        await strategy.getIdentity(credentials),
      );
      strategy.saveIdentity(req, identity);
      return {
        type: 'Callback',
        isSuccess: strategy.validate(identity, credentials),
      };
    }
    return {
      type: 'OAUTH2',
      redirect_url: strategy.OAUTH2_URI,
    };
  };
