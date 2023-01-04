import { decode_jwt } from '../decode_jwt';

describe('decode_jwt unit test', () => {
  it.each(['1235', '123.34'])('if token is not jwt', (token) => {
    const result = decode_jwt(token);
    expect(result).toEqual({});
  });
  it('if token is jwt', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const result = decode_jwt(jwt);
    expect(result).toEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });
});
