export const decode_jwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return {};
  }
};
