import {
  authenticate,
  AuthException,
  Request,
  Response,
  Strategy,
} from '@COMMON';
import type { NextFunction } from 'express';

export const AuthMiddleware =
  (strategy: Strategy) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authenticate(strategy)(req);
    if (result.type === 'OAUTH2') {
      res.redirect(308, strategy.OAUTH2_URI);
      return;
    }
    if (result.isSuccess) {
      next();
    } else {
      throw new AuthException(401, 'Unauthorized');
    }
  };
