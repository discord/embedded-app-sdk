### Creating a full URL instead of a relative URL

There are scenarios where instead of using a relative url (`/path/to/my/thing`) you may want or need to reference the full url when making a network request. The URL is a combination of the following

1. The protocol you wish to use
2. Your application's client id
3. The discord proxy domain
4. Whatever you need to list

Here's an example of how to build a full url, using the URL constructor:

```ts
const protocol = `https`;
const clientId = '<YOUR CLIENT ID>';
const proxyDomain = 'discordsays.com';
const resourcePath = '/foo/bar.jpg';
const url = new URL(`${protocol}://${clientId}.${proxyDomain}${resourcePath}`);
```

In other words, given an application client id of `12345678`
| Relative Path | Full Path |
|-|-|
| /foo/bar.jpg | https://12345678.discordsays.com/foo/bar.jpg |
