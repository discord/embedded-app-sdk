import {Env} from './types';
import tokenHandler from './handlers/tokenHandler';
import iapHandler from './handlers/iapHandler';

export function handleApiRequest(path: string[], request: Request, env: Env) {
  // We've received at API request. Route the request based on the path.
  switch (path[0]) {
    case 'token':
      return tokenHandler(path, request, env);
    case 'iap':
      return iapHandler(path, request, env);
    default:
      return new Response('Not found', {status: 404});
  }
}
