export const PROXY_PREFIX = '/.proxy';

/**
 * Creates a regular expression from a target string. The target string
 * may contain `{name}` tokens which will end up being translated to
 * a named group match for a series of word characters with the group named `name`
 * The substitution pattern is {a-z} because the named groups must be valid JS identifiers,
 * making items like {0} invalid.
 *
 * @returns a RegExp object
 **/
const SUBSTITUTION_REGEX = /\{([a-z]+)\}/g;
function regexFromTarget(target: string): RegExp {
  const regexString = target.replace(SUBSTITUTION_REGEX, (match, name) => `(?<${name}>[\\w-]+)`);
  return new RegExp(`${regexString}(/|$)`);
}

export interface MatchAndRewriteURLInputs {
  originalURL: URL;
  prefixHost: string;
  prefix: string;
  target: string;
}

/**
 *
 * Attempts to map the actual url (i.e. google.com) to a url path, per the url
 * mappings set up in the embedded application. If the target contains `{foo}`
 * tokens, they will be replace with the values contained in the original URL,
 * via the pattern described in the prefix
 *
 * @returns  null if URL doesn't match prefix, otherwise return rewritten URL
 */
export function matchAndRewriteURL({originalURL, prefix, prefixHost, target}: MatchAndRewriteURLInputs): URL | null {
  // coerce url with filler https protocol so we can retrieve host and pathname from target
  const targetURL = new URL(`https://${target}`);
  // Depending on the environment, the URL constructor may turn `{` and `}` into `%7B` and `%7D`, respectively
  const targetRegEx = regexFromTarget(targetURL.host.replace(/%7B/g, '{').replace(/%7D/g, '}'));
  const match = originalURL.toString().match(targetRegEx);
  // Null match indicates that this target is not relevant
  if (match == null) return originalURL;
  const newURL = new URL(originalURL.toString());
  newURL.host = prefixHost;
  newURL.pathname = prefix.replace(SUBSTITUTION_REGEX, (_, matchName) => {
    const replaceValue = match.groups?.[matchName];
    if (replaceValue == null) throw new Error('Misconfigured route.');
    return replaceValue;
  });

  // Append the original path
  newURL.pathname += newURL.pathname === '/' ? originalURL.pathname.slice(1) : originalURL.pathname;
  // prepend /.proxy/ to path if using discord activities proxy
  if (
    (newURL.hostname.includes('discordsays.com') || newURL.hostname.includes('discordsez.com')) &&
    !newURL.pathname.startsWith(PROXY_PREFIX)
  ) {
    newURL.pathname = PROXY_PREFIX + newURL.pathname;
  }
  // Remove the target's path from the new url path
  newURL.pathname = newURL.pathname.replace(targetURL.pathname, '');
  // Add a trailing slash if original url had it, and if it doesn't already have one or if matches filename regex
  if (originalURL.pathname.endsWith('/') && !newURL.pathname.endsWith('/')) {
    newURL.pathname += '/';
  }
  return newURL;
}

export function absoluteURL(
  url: string,
  protocol: string = window.location.protocol,
  host: string = window.location.host,
): URL {
  // If the first arg is a complete url, it will ignore the second arg
  // This call structure lets us set relative urls to have a full url with the proper protocol and host
  return new URL(url, `${protocol}//${host}`);
}
