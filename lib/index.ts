// common
export { AuthGuard, AbstractAuthGuard } from './common/auth.guard';
export type {
  Strategy,
  Credentials,
  Request,
  Response,
} from './common/common.interface';
export type { Google } from './packages/google/google.interface';

export { AbstractStrategy } from './strategy';

export * as Github from './packages/github';
