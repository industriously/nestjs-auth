import { JwtFromRequestFunction } from './jwt.interface';

export const Header =
  (name: string): JwtFromRequestFunction =>
  (req) =>
    req.headers[name.toLowerCase()] as string;

export const Body =
  (name: string): JwtFromRequestFunction =>
  (req) => {
    const body = req.body as { [key: string]: string };
    return body[name];
  };

export const Query =
  (name: string): JwtFromRequestFunction =>
  (req) =>
    req.query[name] as string;

export const Cookie =
  (name: string): JwtFromRequestFunction =>
  (req) => {
    const cookies = req.cookies as { [key: string]: string };
    return cookies[name];
  };

export const AuthorizationHeaderAsScheme =
  (scheme: string): JwtFromRequestFunction =>
  (req) => {
    const scheme_lower = scheme.toLowerCase();
    const headers = req.headers['authorization']?.split(' ');
    if (headers && headers.length >= 2) {
      if (headers[0] === scheme_lower) {
        return headers[1];
      }
    }
    return null;
  };

export const AuthorizationHeaderAsBearer: JwtFromRequestFunction =
  AuthorizationHeaderAsScheme('bearer');
