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
      const identity = await strategy.getIdentity(credentials);
      const isSuccess = strategy.validate(identity, credentials);
      if (isSuccess) {
        strategy.saveIdentity(req, strategy.transform(identity));
      }
      return { type: 'Callback', isSuccess };
    }
    return {
      type: 'OAUTH2',
      redirect_url: strategy.OAUTH2_URI,
    };
  };
