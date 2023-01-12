import { AbstractGoogleStrategy } from './packages/google/google.strategy';
import { AbstractGithubStrategy } from './packages/github/github.strategy';

export namespace AbstractStrategy {
  export const Google = AbstractGoogleStrategy;
  export const Github = AbstractGithubStrategy;
}
