import {absoluteURL, matchAndRewriteURL, PROXY_PREFIX} from './url';

export interface Mapping {
  prefix: string;
  target: string;
}
export interface RemapInput {
  url: URL;
  mappings: Mapping[];
}

interface PatchUrlMappingsConfig {
  patchFetch?: boolean;
  patchWebSocket?: boolean;
  patchXhr?: boolean;
  patchSrcAttributes?: boolean;
}

export function patchUrlMappings(
  mappings: Mapping[],
  {patchFetch = true, patchWebSocket = true, patchXhr = true, patchSrcAttributes = false}: PatchUrlMappingsConfig = {},
) {
  // Bail out if we're not in a browser
  if (typeof window === 'undefined') return;

  if (patchFetch) {
    const fetchImpl = window.fetch;
    // fetch is a duplex, but this is consistent
    window.fetch = function (input: RequestInfo | URL | Request | any, init?: RequestInit) {
      // If fetch has Request as input, we need to resolve any stream
      // before we create a new request with the mapped url
      if (input instanceof Request) {
        const newUrl = attemptRemap({url: absoluteURL(input.url), mappings});
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {url, ...newInit} = (init ?? {}) as RequestInit & {url: any};
        Object.keys(Request.prototype).forEach((value) => {
          if (value === 'url') return;
          try {
            // @ts-expect-error
            newInit[value] = input[value];
          } catch (ex) {
            console.warn(`Remapping fetch request key "${value}" failed`, ex);
          }
        });

        return new Promise((resolve, reject) => {
          try {
            input.blob().then((blob) => {
              if (input.method.toUpperCase() !== 'HEAD' && input.method.toUpperCase() !== 'GET' && blob.size > 0) {
                newInit.body = blob;
              }

              resolve(fetchImpl(new Request(newUrl, newInit)));
            });
          } catch (ex) {
            reject(ex);
          }
        });
      }

      // Assuming a generic url or string
      const remapped = attemptRemap({url: input instanceof URL ? input : absoluteURL(input), mappings});
      return fetchImpl(remapped, init);
    };
  }
  if (patchWebSocket) {
    class WebSocketProxy extends WebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        const remapped = attemptRemap({url: url instanceof URL ? url : absoluteURL(url), mappings});
        super(remapped, protocols);
      }
    }
    window.WebSocket = WebSocketProxy;
  }

  if (patchXhr) {
    const openImpl = XMLHttpRequest.prototype.open;
    // @ts-expect-error - the ts interface exports two 'open' methods
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      async: boolean,
      username?: string | null,
      password?: string | null,
    ) {
      const remapped = attemptRemap({url: absoluteURL(url), mappings});
      openImpl.apply(this, [method, remapped, async, username, password]);
    };
  }

  if (patchSrcAttributes) {
    const callback: MutationCallback = function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          attemptSetNodeSrc(mutation.target, mappings);
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            attemptSetNodeSrc(node, mappings);
            recursivelyRemapChildNodes(node, mappings);
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    const config: MutationObserverInit = {
      attributeFilter: ['src'],
      childList: true,
      subtree: true,
    };
    observer.observe(window.document, config);

    window.document.querySelectorAll('[src]').forEach((node) => {
      attemptSetNodeSrc(node, mappings);
    });
  }
}

function recursivelyRemapChildNodes(node: Node, mappings: Mapping[]) {
  if (node.hasChildNodes()) {
    node.childNodes.forEach((child) => {
      attemptSetNodeSrc(child, mappings);
      recursivelyRemapChildNodes(child, mappings);
    });
  }
}

function attemptSetNodeSrc(node: Node, mappings: Mapping[]) {
  if (node instanceof HTMLElement && node.hasAttribute('src')) {
    const rawSrc = node.getAttribute('src');
    const url = absoluteURL(rawSrc ?? '');
    if (url.host === window.location.host) return;

    if (node.tagName.toLowerCase() === 'script') {
      // Scripts are a special case, and need to be wholly recreated since
      // modifying a script tag doesn't refetch.
      attemptRecreateScriptNode(node, {url, mappings});
    } else {
      const newSrc = attemptRemap({url, mappings}).toString();
      // Only apply the remapping if we actually remapped the value
      if (newSrc !== rawSrc) {
        node.setAttribute('src', newSrc);
      }
    }
  }
}

function attemptRecreateScriptNode(node: HTMLElement, {url, mappings}: RemapInput) {
  const newUrl = attemptRemap({url, mappings});
  if (url.toString() !== newUrl.toString()) {
    // Note: Script tags cannot be duplicated via `node.clone()` because their internal 'already started'
    // state prevents the new one from being fetched. We must manually recreate the duplicate tag instead.
    const newNode = document.createElement(node.tagName);
    newNode.innerHTML = node.innerHTML;
    for (const attr of node.attributes) {
      newNode.setAttribute(attr.name, attr.value);
    }
    newNode.setAttribute('src', attemptRemap({url, mappings}).toString());
    node.after(newNode);
    node.remove();
  }
}

export function attemptRemap({url, mappings}: RemapInput): URL {
  const newURL = new URL(url.toString());
  if (
    (newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) &&
    // Only apply proxy prefix once
    !newURL.pathname.startsWith(PROXY_PREFIX)
  ) {
    newURL.pathname = PROXY_PREFIX + newURL.pathname;
  }
  for (const mapping of mappings) {
    const mapped = matchAndRewriteURL({
      originalURL: newURL,
      prefix: mapping.prefix,
      target: mapping.target,
      prefixHost: window.location.host,
    });
    if (mapped != null && mapped?.toString() !== url.toString()) {
      return mapped;
    }
  }
  return newURL;
}
