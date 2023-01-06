export const decode_jwt = <T extends {}>(token: string): T | {} => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (e) {
    return {};
  }
};
