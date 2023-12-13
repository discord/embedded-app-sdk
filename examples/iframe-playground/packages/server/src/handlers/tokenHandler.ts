import {Env, IGetOAuthToken} from '../types';
import {readRequestBody, requestHeaders} from '../utils';

export default async function tokenHandler(path: string[], request: Request, env: Env) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    const tokenBody = new URLSearchParams({
      client_id: env.VITE_CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: body.code,
    });
    const response = await fetch(`${env.VITE_DISCORD_API_BASE}/oauth2/token`, {
      method: 'POST',
      headers: requestHeaders(env, {
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: tokenBody,
    });

    if (response.status != 200) {
      return response;
    }

    const {access_token} = await response.json<IGetOAuthToken>();

    return new Response(JSON.stringify({access_token}), {
      headers: {'Access-Control-Allow-Origin': '*'},
    });
  } catch (ex) {
    console.error(ex);
    return new Response(`Internal Error: ${ex}`, {status: 500});
  }
}
