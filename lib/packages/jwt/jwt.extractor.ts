import { isString } from '@LIB/utils';
import { JwtFromRequestFunction } from './jwt.interface';

export const Header =
  (name: string): JwtFromRequestFunction =>
  (req) =>
    req.headers[name.toLowerCase()];

export const Body =
  (name: string): JwtFromRequestFunction =>
  (req) => {
    const body: any = req.body;
    return body[name];
  };

export const Query =
  (name: string): JwtFromRequestFunction =>
  (req) =>
    req.query[name];

export const Cookie =
  (name: string): JwtFromRequestFunction =>
  (req) => {
    const cookies: any = req.cookies;
    return cookies[name];
  };

export const AuthorizationHeaderAsScheme =
  (scheme: string): JwtFromRequestFunction =>
  (req) => {
    const regex = new RegExp(`^${scheme}\\s+\\S+`, 'i');
    const header = req.headers['authorization'];
    if (!isString(header)) {
      return null;
    }
    const token = header.match(regex);
    return token ? token[0].split(/\s+/)[1] : null;
  };

export const AuthorizationHeaderAsBearer: JwtFromRequestFunction =
  AuthorizationHeaderAsScheme('bearer');
