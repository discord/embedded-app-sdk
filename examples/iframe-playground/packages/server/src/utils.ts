import {Env} from './types';
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
export async function readRequestBody(request: Request) {
  const {headers} = request;
  const contentType = headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body: Record<string, any> = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }
}

export const hasFlag = (currentFlags: number, flag: number): boolean => (currentFlags & flag) > 0;

export function requestHeaders(env: Env, customHeaders: Record<string, string> = {}): Headers {
  const headers = new Headers();

  // for some environments (namely, staging) we use cloudflare service tokens
  // (https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/)
  // to bypass cloudflare access
  if (env.CF_ACCESS_CLIENT_ID != null) {
    headers.set('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID);
  }
  if (env.CF_ACCESS_CLIENT_SECRET != null) {
    headers.set('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET);
  }

  // assumes using bot token for auth by default
  headers.set('Authorization', `Bot ${env.BOT_TOKEN}`);

  Object.entries(customHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return headers;
}
