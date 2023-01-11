import type { NotRequestKey } from './common.interface';

export interface GithubOauth2Options {
  readonly client_id: string;
  readonly client_secret: string;
  readonly redirect_uri: string;
  readonly scope: GithubScope[];
  readonly allow_signup?: boolean;
}

export interface GithubStrategyOptions<T = 'user'> extends GithubOauth2Options {
  readonly key: NotRequestKey<T>;
}

export type GithubScope =
  | 'repo'
  | 'repo:status'
  | 'repo_deployment'
  | 'public_repo'
  | 'repo:invite'
  | 'security_events'
  | 'admin:repo_hook'
  | 'write:repo_hook'
  | 'read:repo_hook'
  | 'admin:org'
  | 'write:org'
  | 'read:org'
  | 'admin:public_key'
  | 'write:public_key'
  | 'read:public_key'
  | 'admin:org_hook'
  | 'gist'
  | 'notifications'
  | 'user'
  | 'read:user'
  | 'user:email'
  | 'user:follow'
  | 'project'
  | 'read:project'
  | 'delete_repo'
  | 'write:discussion'
  | 'read:discussion'
  | 'write:packages'
  | 'read:packages'
  | 'delete:packages'
  | 'admin:gpg_key'
  | 'write:gpg_key'
  | 'read:gpg_key'
  | 'codespace'
  | 'workflow';

export interface GithubPublicUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  collaborators?: number;
  plain?: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };
  suspended_at?: string | null;
}

export interface GithubPrivateUser extends GithubPublicUser {
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  business_plus?: boolean;
  ldap_dn?: string;
}

export interface GIthubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private' | null;
}
