// common
export { AuthGuard, AbstractAuthGuard } from './common/auth.guard';
export type { Strategy } from './interface/common.interface';

// google
export { AbstractGoogleStrategy } from './google/google.strategy';
export type {
  GoogleStrategyOptions,
  GoogleIdToken,
} from './interface/google.interface';

// github
export { AbstractGithubStrategy } from './github/github.strategy';
export type {
  GithubStrategyOptions,
  GithubScope,
  GithubUser,
  GIthubEmail,
} from './interface/github.interface';
