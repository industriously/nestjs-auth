// common
export { AuthGuard, AbstractAuthGuard } from './common/auth.guard';
export type { Strategy } from './interface/common.interface';

// google
import { AbstractGoogleStrategy } from './google/google.strategy';
export type { Google } from './interface/google.interface';

// github
import { AbstractGithubStrategy } from './github/github.strategy';
export type { Github } from './interface/github.interface';

export namespace AbstractStrategy {
  export const Google = AbstractGoogleStrategy;
  export const Github = AbstractGithubStrategy;
}
