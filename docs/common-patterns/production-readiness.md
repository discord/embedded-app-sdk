# Production Readiness

There are considerations your application will have to make as it gets ready for production. While we can't document all the things that may happen at massive scale, here are some considerations that we think will be essential to your application scaling smoothly.

## Cache Busting

All assets loaded by your application will respect [cache headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). One exception is that Discord's application proxy will remove any cache headers for assets whose `content-type` headers include `text/html`. For all non-`text/html` content that your application plans to serve, be sure your application has a cache-busting strategy. This is often built into build processes. If your application has a static filename for its javascript or css, please be sure to implement cache busting techniques, for example [webpack enables creating a content hash and manifest](https://webpack.js.org/guides/caching/) as a part of the build process.

## Rate Limit Handling

Be sure network requests made by your application's client and server will be able to respect Discord API's rate limiting [as described here](https://discord.com/developers/docs/topics/rate-limits). For reference, consider the 429 error handling example described [here](/docs/common-patterns/handling-429-error-codes.md)

## Static IP Addresses

If your application's server is utilizing a dynamically assigned IP address (this is standard for cloud functions), there is a non-zero chance that you will inherit from a previous bad actor an IP address which has been banned by Cloudflare. In this scenario any egress traffic from the IP address directed towards Discord's API will be banned for up-to an hour. The best way to mitigate this situation is to set up a static IP address for all of your application server's egress traffic to be routed through.
