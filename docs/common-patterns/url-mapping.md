# URL Mapping

Activities in the Discord ecosystem are "sandboxed" via a discord proxy. This is done to hide the users’ IP addresses, your application's IP addresses, and to block urls from known malicious endpoints. As an application owner, you can configure the proxy to allow network requests to external endpoints, as needed.

Because your application is "sandboxed", it will be unable to make network requests to external urls.
Let's say you want to make a request to `https://some-api.com`. To enable reaching this url
from inside of your application, you will create a new url mapping, with the `PREFIX` set to
`/api` and `TARGET` set to `some-api.com`. Now you can make requests to `/api` from inside of your application, which will be forwarded, via Discord's proxy to `some-api.com`.

## How to set a URL Mapping

⚠️ **This is not possible until your application is marked "Embedded" by Discord.** ⚠️  
More info about marking you application embedded [here](/docs/setting-up-your-discord-application.md#marking-your-application-as-embedded)  
Once your application has been marked as `EMBEDDED`, the developer portal will render a section for your application named `Embedded Application`. To add or modify your application's URL mappings, click on this section and set the prefix and target values for each mapping as needed.

![URL Mapping Screenshot](/docs/assets/url-mapping.png)

## Prefix/Target formatting rules

- URL mappings can utilize any url protocol, (https, wss, ftp, etc...), which is why the URL target should not include a protocol. For example, for a URL target, do not put `https://your-url.com`, instead, omit `https://` and use `your-url.com`.
- Parameter matching can be used to help map external domain urls. For example, if an external url has many subdomains, such as `foo.google.com`, `bar.google.com`, then you could use the following mapping:
  | PREFIX | TARGET |
  | ------ | ------ |
  | /google/{subdomain} | {subdomain}.google.com |
- Because of how URL globbing works, if you have multiple prefix urls with the same initial path, you must place the shortest of the prefix paths last in order for each url mapping to be reachable. For example, if you have `/foo` and `/foo/bar`, you must place the url `/foo/bar` before `/foo` or else the mapping for `/foo/bar` will never be reached.

| ✅ DO                                                  | ❌ DON'T                                                   |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| Requests mapped correctly                              | Requests to /foo/bar will incorrectly be sent to `foo.com` |
| ![url-mapping-do.png](/docs/assets/url-mapping-do.png) | ![url-mapping-dont.png](/docs/assets/url-mapping-dont.png) |

## Exceptions

The aforementioned "sandbox" is enforced by a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). We have some notable exceptions to our CSP, meaning application clients may make requests to these URLs without hitting the proxy and therefore without establishing mappings. Notable exceptions include:

- `https://discord.com`
- `https://canary.discord.com`
- `https://ptb.discord.com`
- `https://cdn.discordapp.com`
- `https://media.discordapp.net`
