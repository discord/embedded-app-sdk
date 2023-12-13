## Running an application locally

It is possible to load your application via a localhost port or other unique url. This url must support an https connection in order to load on the web/desktop Discord app (https is not required for mobile). The downside to this flow is that your application's network traffic will not pass through Discord's proxy, which means any requests made by the application will need to use a full url instead of a ["mapped"](/docs/common-patterns/url-mapping.md) url.

To run your locally hosted application, follow the instructions for [Launching your Application from the Discord Client](/docs/common-patterns/launching-your-application.md) and set the Application URL Override to the address of your application's web server.

## Running an application through a network tunnel

Although it is possible to test your application locally, we recommend developing and testing against the actual Discord Proxy. This is helpful to make sure all urls behave as expected before your application is put into production. One technique to enable testing locally against the proxy is to use a network tunneling tool, such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared). A common pattern is for each developer to have their own "development-only" application. In order to set up a local environment to run through Discord's proxy, you will need to do the following:

1. Create a new application and have it flagged as "embedded"
2. Set up the application's url mapping (as described [here](/docs/common-patterns/url-mapping.md)).
3. Locally, spin up your web server
4. Install and run a tunnel solution, such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared). You will point it to your local web server. (Note, your web server can be http, and your tunnel will then turn the connection into https)  
   If using cloudflared, you will run the following command. Replace 3000 with your web server's port.

```sh
cloudflared tunnel --url http://localhost:3000
```

5. From the Discord Developer portal, update your Application URL mapping for `/` to point at your local server. For example, if using cloudflared, it will display the following message:

   > Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  
   > https://funky-jogging-bunny.trycloudflare.com

In the developer portal, set the `/` url to `funky-jogging-bunny.trycloudflare.com` and save your changes.
![example-updating-tunnel-route](/docs/assets/update-tunnel-route.png)

⚠️If you do not own the url that you are using to host the application (i.e. ngrok's free tier) someone else could claim that domain and host a malicious site in its place. Please be aware of these risks, and, if have to use a domain you do not own, be sure to reset your url mapping when you are done using the tunnel. ⚠️

6. Follow the instructions for [Launching your Application from the Discord Client](/docs/common-patterns/launching-your-application.md). Application URL Override should not be enabled.

## Running an application in production

The flow for setting up your application for production is very similar.

1. If not made yet, create a new application and have it flagged as "embedded"
2. Set up the application's url mapping (as described [here](/docs/common-patterns/url-mapping.md)). The url for your application's html should be set to the `/` route.
3. Follow the instructions for [Launching your Application from the Discord Client](/docs/common-patterns/launching-your-application.md). Application URL Override should not be enabled.

This application is now using the same configuration it will use once it is fully published ✨.
![application-test-mode-prod](/docs/assets/application-test-mode-prod.gif)
