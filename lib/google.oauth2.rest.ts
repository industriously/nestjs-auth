import http from 'http';
import url from 'url';

const OauthEndPoint = 'https://accounts.google.com/o/oauth2/v2/auth';

interface GoogleOauthParameters {
  readonly client_id: string;
  readonly redirect_uri: string;
  readonly response_type: 'code';
  /**
   * ex) scope: ['email', 'profile']
   */
  readonly scope: string[]; // join(" ")
  readonly access_type?: 'online' | 'offline';
  readonly state?: string;
  readonly include_granted_scopes?: boolean;
  readonly login_hint?: string;
  /**
   * none - 인증 또는 동의 화면을 표시하지 않습니다. 다른 값과 함께 지정하면 안 됩니다.
   * consent - 사용자에게 동의를 요청합니다.
   * select_account - 사용자에게 계정을 선택하라는 메시지를 표시합니다.
   */
  readonly prompt?: 'none' | 'consent' | 'select_account';
}

/**
 * 구글 로그인 URI 생성 함수
 */
const generate_oauth2_uri = (
  url: string,
  { scope, ...params }: GoogleOauthParameters,
) => {
  const query: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    query.push(`${key}=${value}`);
  }
  return (
    url +
    '?' +
    query.join('&') +
    (scope.length > 0 ? `&scope=${scope.join(' ')}` : '')
  );
};

/**
 * 구글 로그인 URI
 */
const oauthURI = generate_oauth2_uri(OauthEndPoint, {
  client_id: 'CLIENT_ID',
  redirect_uri: 'http://localhost:4000/oauth/callback',
  response_type: 'code',
  scope: ['email', 'profile'],
  access_type: 'online',
});
