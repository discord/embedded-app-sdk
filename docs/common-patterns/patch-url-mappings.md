## patchUrlMappings

Activities in the Discord ecosystem are “sandboxed” via a discord proxy. This is done to hide the users’ IP addresses as well as block urls from known malicious endpoints. To achieve this, the developer portal has a section for embedded applications called "URL Mappings". One edge-case of URL mappings is that third-party npm modules may reference external (non-sandbox'd) urls.

For example, if your application has an npm module that attempts to make an http request to https://foo.library.com, the request will fail with a `blocked:csp` error.

To get around this limitation there are several options to consider:

- Fork the library (to use mapped urls)
- Utilize a post-install utility such as [patch-package](https://www.npmjs.com/package/patch-package)
- Use embedded-app-sdk's `patchUrlMappings` api

In the above scenario we recommend the `patchUrlMappings` api, as it will allow a smooth transition from the non-sandboxed dev environment to the prod environment. This api call takes an array of "mappings" which will transform any external network requests to the mappings you've defined.

See the example below:
In this example, imagine you have a third party library which makes an http request to foo.com
In the developer portal, create a mapping like this:
`/foo` -> `foo.com`
Then in your code, when initializing the embedded-app-sdk, you will make a function call like this:

```tsx
import {patchUrlMappings} from '@discord/embedded-app-sdk';
patchUrlMappings([{prefix: '/foo', target: 'foo.com'}]);
```

Note: `patchUrlMappings` is modifying your browser's `fetch`, `WebSocket`, and `XMLHttpRequest.prototype.open` global variables, as well as modifying any html element's `src` attribute. Depending on the library, you may see side effects from using this helper function. It should be used only when necessary.
