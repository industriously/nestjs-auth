import queryString from 'querystring';
import axios from 'axios';
import type { GithubOauth2Options } from '@INTERFACE/github.interface';

const OAUTH2_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_URL = 'https://github.com/user';
const USER_EMAILS_URL = 'https://github.com/user/emails';

export const get_oauth2_uri = ({
  client_id,
  redirect_uri,
  scope,
  allow_signup = true,
}: GithubOauth2Options) =>
  OAUTH2_URL +
  '?' +
  queryString.stringify({
    client_id,
    redirect_uri,
    allow_signup,
    scope: scope.join(' '),
  });

export const get_access_token =
  ({ client_id, client_secret }: GithubOauth2Options) =>
  (code: string): Promise<string | null> =>
    axios
      .post<{
        access_token: string;
        scope: string;
        token_type: string;
      }>(
        ACCESS_TOKEN_URL,
        {
          code,
          client_id,
          client_secret,
        },
        { headers: { Accept: 'application/json' } },
      )
      .then(({ data: { access_token } }) => access_token)
      .catch(() => null);

export const get_profile = (token: string) => {
  const headers = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-Github-Api-Version': '2022-11-28',
  };
  Promise.all([
    axios.get(USER_URL, { headers }),
    axios.get(USER_EMAILS_URL, { headers }),
  ]).then(([{ data: data1 }, { data: data2 }]) => {});
};

interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  name?: string;
  email?: string;
}

{
  "oneOf": [
    {
      "title": "Private User",
      "description": "Private User",
      "type": "object",
      "properties": {
        "login": {
          "type": "string",
          "examples": [
            "octocat"
          ]
        },
        "id": {
          "type": "integer",
          "examples": [
            1
          ]
        },
        "node_id": {
          "type": "string",
          "examples": [
            "MDQ6VXNlcjE="
          ]
        },
        "avatar_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://github.com/images/error/octocat_happy.gif"
          ]
        },
        "gravatar_id": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "41d064eb2195891e12d0413f63227ea7"
          ]
        },
        "url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat"
          ]
        },
        "html_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://github.com/octocat"
          ]
        },
        "followers_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat/followers"
          ]
        },
        "following_url": {
          "type": "string",
          "examples": [
            "https://api.github.com/users/octocat/following{/other_user}"
          ]
        },
        "gists_url": {
          "type": "string",
          "examples": [
            "https://api.github.com/users/octocat/gists{/gist_id}"
          ]
        },
        "starred_url": {
          "type": "string",
          "examples": [
            "https://api.github.com/users/octocat/starred{/owner}{/repo}"
          ]
        },
        "subscriptions_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat/subscriptions"
          ]
        },
        "organizations_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat/orgs"
          ]
        },
        "repos_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat/repos"
          ]
        },
        "events_url": {
          "type": "string",
          "examples": [
            "https://api.github.com/users/octocat/events{/privacy}"
          ]
        },
        "received_events_url": {
          "type": "string",
          "format": "uri",
          "examples": [
            "https://api.github.com/users/octocat/received_events"
          ]
        },
        "type": {
          "type": "string",
          "examples": [
            "User"
          ]
        },
        "site_admin": {
          "type": "boolean"
        },
        "name": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "monalisa octocat"
          ]
        },
        "company": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "GitHub"
          ]
        },
        "blog": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "https://github.com/blog"
          ]
        },
        "location": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "San Francisco"
          ]
        },
        "email": {
          "type": [
            "string",
            "null"
          ],
          "format": "email",
          "examples": [
            "octocat@github.com"
          ]
        },
        "hireable": {
          "type": [
            "boolean",
            "null"
          ]
        },
        "bio": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "There once was..."
          ]
        },
        "twitter_username": {
          "type": [
            "string",
            "null"
          ],
          "examples": [
            "monalisa"
          ]
        },
        "public_repos": {
          "type": "integer",
          "examples": [
            2
          ]
        },
        "public_gists": {
          "type": "integer",
          "examples": [
            1
          ]
        },
        "followers": {
          "type": "integer",
          "examples": [
            20
          ]
        },
        "following": {
          "type": "integer",
          "examples": [
            0
          ]
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "examples": [
            "2008-01-14T04:33:35Z"
          ]
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "examples": [
            "2008-01-14T04:33:35Z"
          ]
        },
        "private_gists": {
          "type": "integer",
          "examples": [
            81
          ]
        },
        "total_private_repos": {
          "type": "integer",
          "examples": [
            100
          ]
        },
        "owned_private_repos": {
          "type": "integer",
          "examples": [
            100
          ]
        },
        "disk_usage": {
          "type": "integer",
          "examples": [
            10000
          ]
        },
        "collaborators": {
          "type": "integer",
          "examples": [
            8
          ]
        },
        "two_factor_authentication": {
          "type": "boolean",
          "examples": [
            true
          ]
        },
        "plan": {
          "type": "object",
          "properties": {
            "collaborators": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "space": {
              "type": "integer"
            },
            "private_repos": {
              "type": "integer"
            }
          },
          "required": [
            "collaborators",
            "name",
            "space",
            "private_repos"
          ]
        },
        "suspended_at": {
          "type": [
            "string",
            "null"
          ],
          "format": "date-time"
        },
        "business_plus": {
          "type": "boolean"
        },
        "ldap_dn": {
          "type": "string"
        }
      },
      "required": [
        "avatar_url",
        "events_url",
        "followers_url",
        "following_url",
        "gists_url",
        "gravatar_id",
        "html_url",
        "id",
        "node_id",
        "login",
        "organizations_url",
        "received_events_url",
        "repos_url",
        "site_admin",
        "starred_url",
        "subscriptions_url",
        "type",
        "url",
        "bio",
        "blog",
        "company",
        "email",
        "followers",
        "following",
        "hireable",
        "location",
        "name",
        "public_gists",
        "public_repos",
        "created_at",
        "updated_at",
        "collaborators",
        "disk_usage",
        "owned_private_repos",
        "private_gists",
        "total_private_repos",
        "two_factor_authentication"
      ]
    },
    {
      "title": "Public User",
      "description": "Public User",
      "type": "object",
      "properties": {
        "login": {
          "type": "string"
        },
        "id": {
          "type": "integer"
        },
        "node_id": {
          "type": "string"
        },
        "avatar_url": {
          "type": "string",
          "format": "uri"
        },
        "gravatar_id": {
          "type": [
            "string",
            "null"
          ]
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "html_url": {
          "type": "string",
          "format": "uri"
        },
        "followers_url": {
          "type": "string",
          "format": "uri"
        },
        "following_url": {
          "type": "string"
        },
        "gists_url": {
          "type": "string"
        },
        "starred_url": {
          "type": "string"
        },
        "subscriptions_url": {
          "type": "string",
          "format": "uri"
        },
        "organizations_url": {
          "type": "string",
          "format": "uri"
        },
        "repos_url": {
          "type": "string",
          "format": "uri"
        },
        "events_url": {
          "type": "string"
        },
        "received_events_url": {
          "type": "string",
          "format": "uri"
        },
        "type": {
          "type": "string"
        },
        "site_admin": {
          "type": "boolean"
        },
        "name": {
          "type": [
            "string",
            "null"
          ]
        },
        "company": {
          "type": [
            "string",
            "null"
          ]
        },
        "blog": {
          "type": [
            "string",
            "null"
          ]
        },
        "location": {
          "type": [
            "string",
            "null"
          ]
        },
        "email": {
          "type": [
            "string",
            "null"
          ],
          "format": "email"
        },
        "hireable": {
          "type": [
            "boolean",
            "null"
          ]
        },
        "bio": {
          "type": [
            "string",
            "null"
          ]
        },
        "twitter_username": {
          "type": [
            "string",
            "null"
          ]
        },
        "public_repos": {
          "type": "integer"
        },
        "public_gists": {
          "type": "integer"
        },
        "followers": {
          "type": "integer"
        },
        "following": {
          "type": "integer"
        },
        "created_at": {
          "type": "string",
          "format": "date-time"
        },
        "updated_at": {
          "type": "string",
          "format": "date-time"
        },
        "plan": {
          "type": "object",
          "properties": {
            "collaborators": {
              "type": "integer"
            },
            "name": {
              "type": "string"
            },
            "space": {
              "type": "integer"
            },
            "private_repos": {
              "type": "integer"
            }
          },
          "required": [
            "collaborators",
            "name",
            "space",
            "private_repos"
          ]
        },
        "suspended_at": {
          "type": [
            "string",
            "null"
          ],
          "format": "date-time"
        },
        "private_gists": {
          "type": "integer",
          "examples": [
            1
          ]
        },
        "total_private_repos": {
          "type": "integer",
          "examples": [
            2
          ]
        },
        "owned_private_repos": {
          "type": "integer",
          "examples": [
            2
          ]
        },
        "disk_usage": {
          "type": "integer",
          "examples": [
            1
          ]
        },
        "collaborators": {
          "type": "integer",
          "examples": [
            3
          ]
        }
      },
      "required": [
        "avatar_url",
        "events_url",
        "followers_url",
        "following_url",
        "gists_url",
        "gravatar_id",
        "html_url",
        "id",
        "node_id",
        "login",
        "organizations_url",
        "received_events_url",
        "repos_url",
        "site_admin",
        "starred_url",
        "subscriptions_url",
        "type",
        "url",
        "bio",
        "blog",
        "company",
        "email",
        "followers",
        "following",
        "hireable",
        "location",
        "name",
        "public_gists",
        "public_repos",
        "created_at",
        "updated_at"
      ],
      "additionalProperties": false
    }
  ]
}