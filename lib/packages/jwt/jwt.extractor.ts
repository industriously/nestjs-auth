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
    const regex = new RegExp(`^${scheme}\\s+\\S+`, 'i');
    const header = req.headers['authorization'];
    if (header == null) {
      return null;
    }
    const token = header.match(regex);
    return token ? token[0].split(/\s+/)[1] : null;
  };

export const AuthorizationHeaderAsBearer: JwtFromRequestFunction =
  AuthorizationHeaderAsScheme('bearer');
