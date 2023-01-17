import http from 'https';
import type { FetcherResponse } from '@COMMON';
import type { IncomingMessage } from 'http';

const request =
  (
    resolve: (value: FetcherResponse) => void,
    reject: (value: unknown) => void,
  ) =>
  (res: IncomingMessage) => {
    const chunks: Uint8Array[] = [];
    res.on('error', reject);
    res.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    res.on('end', () => {
      if (res.statusCode === undefined) {
        resolve({
          statusCode: 500,
          data: { message: 'UnValid Response' },
        });
        return;
      }
      const buffer = Buffer.concat(chunks);
      const statusCode = res.statusCode;
      try {
        const data =
          buffer.length > 0 ? (JSON.parse(buffer.toString()) as object) : null;
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
   * @throws network error, stream 'error' events.
   */
  get(uri: string, headers: NonNullable<http.RequestOptions['headers']> = {}) {
    return new Promise<FetcherResponse>((resolve, reject) => {
      const req = http.request(
        uri,
        { headers, method: 'GET' },
        request(resolve, reject),
      );
      if (req.getHeader('User-Agent') === undefined) {
        req.setHeader('User-Agent', 'request');
      }
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
   * @throws network error, stream 'error' events.
   */
  post(
    uri: string,
    body: object | string,
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
      if (req.getHeader('Content-Type') === undefined) {
        req.setHeader('Content-Type', 'application/json');
      }
      if (req.getHeader('User-Agent') === undefined) {
        req.setHeader('User-Agent', 'request');
      }
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
      req.on('error', reject);
      req.end();
    });
  },
};
