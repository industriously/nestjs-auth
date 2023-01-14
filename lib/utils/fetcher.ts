import { FetcherResponse } from '@COMMON/common.interface';
import { IncomingMessage } from 'http';
import http from 'https';

const request =
  (
    resolve: (value: FetcherResponse) => void,
    reject: (value: unknown) => void,
  ) =>
  (res: IncomingMessage) => {
    const chunks: Uint8Array[] = [];
    res.on('error', reject);
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const statusCode = res.statusCode!;
      try {
        const data = buffer.length > 0 ? JSON.parse(buffer.toString()) : null;
        resolve({ statusCode, data });
      } catch (err) {
        resolve({ statusCode, data: buffer.toString() });
      }
    });
  };

export const fetcher = {
  /**
   * http get request
   * @param uri API uri
   * @param headers custom http header in request
   * @returns api response data and status
   * @throws network error or JSON parsing error
   */
  get(uri: string, headers: NonNullable<http.RequestOptions['headers']> = {}) {
    return new Promise<FetcherResponse>((resolve, reject) => {
      const req = http.request(
        uri,
        { headers, method: 'GET' },
        request(resolve, reject),
      );
      req.setHeader('User-Agent', 'request');
      req.on('error', reject);
      req.end();
    });
  },
  /**
   * http post request
   * @param uri API uri
   * @param body a data that client send to server
   * @param headers custom http header in request
   * @returns api response data and status
   * @throws network error or JSON parsing error
   */
  post(
    uri: string,
    body: object,
    headers: NonNullable<http.RequestOptions['headers']> = {},
  ) {
    return new Promise<FetcherResponse>((resolve, reject) => {
      const req = http.request(
        uri,
        {
          method: 'POST',
          headers,
        },
        request(resolve, reject),
      );
      req.setHeader('Content-Type', 'application/json');
      req.setHeader('User-Agent', 'request');
      req.write(JSON.stringify(body));
      req.on('error', reject);
      req.end();
    });
  },
};
