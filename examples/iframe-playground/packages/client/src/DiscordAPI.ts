import {Constants} from './Constants';

export enum RequestType {
  GET = 'GET',
  PATCH = 'PATCH',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export interface DiscordAPIRequest {
  endpoint: string;
  method: RequestType;
  body?: any;
  headers?: Record<string, string>;
  stringifyBody?: boolean;
}

function request<T>(
  {method, endpoint, body, headers: baseHeaders, stringifyBody = false}: DiscordAPIRequest,
  accessToken: string
): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    ...baseHeaders,
  };
  return fetch(`${Constants.urls.discord}${endpoint}`, {
    method,
    headers,
    body: stringifyBody == true ? JSON.stringify(body) : body,
  })
    .then((response) => {
      if (!response.ok || response.status >= 400) {
        console.error('error: ' + response.body);
        throw new Error('error' + response.status);
      }
      return response.json<T>();
    })
    .catch((e) => {
      console.error('error: ' + JSON.stringify(e));
      throw e;
    });
}

export const DiscordAPI = {
  request,
};
