import {absoluteURL, matchAndRewriteURL} from './url';
export interface Mapping {
  prefix: string;
  target: string;
}

export interface RemapInput {
  url: URL;
  mappings: Mapping[];
}

export function attemptRemap({url, mappings}: RemapInput): URL {
  for (const mapping of mappings) {
    const mapped = matchAndRewriteURL({
      originalURL: url,
      prefix: mapping.prefix,
      target: mapping.target,
      prefixHost: window.location.host,
    });
    if (mapped != null && mapped?.toString() !== url.toString()) {
      return mapped;
    }
  }
  return url;
}

export function initializeNetworkShims(mappings: Mapping[]): void {
  // fetch intercept
  const fetchImpl = window.fetch;

  window.fetch = function (input: URL | RequestInfo, init?: RequestInit) {
    const remapped = attemptRemap({url: absoluteURL(input.toString()), mappings});
    return fetchImpl(remapped.toString(), init);
  };

  // xhr intercept
  const openImpl = XMLHttpRequest.prototype.open;
  // @ts-expect-error - the ts interface exports two 'open' methods
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async: boolean,
    username?: string | null,
    password?: string | null
  ) {
    const remapped = attemptRemap({url: absoluteURL(url), mappings});
    openImpl.apply(this, [method, remapped.toString(), async, username, password]);
  };

  // web socket intercept
  class WebSocketProxy extends WebSocket {
    constructor(urlIn: string | URL, protocols?: string | string[]) {
      const url = urlIn instanceof URL ? urlIn.toString() : urlIn;
      const remapped = attemptRemap({url: absoluteURL(url, 'wss:'), mappings});
      super(remapped.toString(), protocols);
    }
  }

  window.WebSocket = WebSocketProxy;
}
