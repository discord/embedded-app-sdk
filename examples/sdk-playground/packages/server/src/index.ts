import {Env} from './types';
import {handleApiRequest} from './handleApiRequest';
import {handleErrors} from './handleErrors';
export default {
  async fetch(request: Request, env: Env) {
    return await handleErrors(request, async () => {
      // We have received an HTTP request! Parse the URL and route the request.

      const url = await new URL(request.url);
      const path = url.pathname.slice(1).split('/');

      switch (path[0]) {
        case 'api':
          // This is a request for `/api/...`, call the API handler.
          return handleApiRequest(path.slice(1), request, env);

        default:
          return new Response('Not found', {status: 404});
      }
    });
  },
};
