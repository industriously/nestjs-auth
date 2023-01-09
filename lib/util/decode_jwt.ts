export const decode_jwt = <T>(token: string): T | undefined => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return undefined;
  }
};
