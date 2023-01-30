export class AuthException extends Error {
  constructor(readonly statusCode: number, message: string = '') {
    super(message);
  }
}
