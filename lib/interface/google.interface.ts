/**
 * oauth2 client option
 */
export interface GoogleOauth2ClientOptions {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

/**
 * 구글 로그인을 위해 필요한 모든 options
 */
export interface GoogleOauth2ModuleOptions extends GoogleOauth2ClientOptions {
  scope: string[] | string;
}
