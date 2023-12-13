# Logging

By default, the SDK will send any console log/warn/error/info/debug triggered by the Application to the Discord application.
These logs are viewable via the browser developer tools console for desktop and the Debug Logs view accessible via User Settings on the mobile app.

## User Experience

### Desktop

Desktop logs are viewable through the console tab inside the developer tools. You can follow this
support article. https://support.discord.com/hc/en-us/articles/115001239472-Troubleshooting-Console-Log-Errors

### Mobile

Mobile logs are viewable via the Debug Logs option inside User Settings on the Mobile App. It is only discoverable when
you have Developer mode ON.

#### Turning Developer Mode ON

1. On the bottom navigation, tap on your avatar to reveal the User Settings view.

![appearance-setting](/docs/assets/appearance-setting.png)

2. Tap Appearance

3. Slide the Developer Mode toggle to ON

![developer-mode-setting](/docs/assets/developer-mode-setting.png)

4. The Debug Log Option should now be visible under DEV

![debug-log-option](/docs/assets/debug-logs-option.png)

#### Filtering for Application Logs

Inside the debug logs view, you can search for your own application logs with the possible keywords:

1. `RpcApplicationLogger`
2. Your Application ID i.e an identifier of the form `904794489342820443`. This can be found in the General Information section inside the Discord Developer Portal.

Each log line is formatted as: `[RpcApplicationLogger] <application-id> - message`

The first section of Debug Logs are not your application logs but Discord specific app startup info which is not relevant to your application. If you scroll down below, your application logs should
be visible. (See preview below).

![debug-logs-filtering](/docs/assets/debug-logs-filtering.gif)

### Sharing Application logs

In order to share your application logs, there is a button in the Voice Channel Controls.
You will need to have developer mode turned on, see [here](#turning-developer-mode-on)

1. In the voice channel, swipe from the bottom to see the expanded voice controls. Tap on
   Share Application Logs.

<img src="assets/share-application-logs.png" width=300/>

2. You'll be presented with a native share sheet where you can save the logs to a file or share it as a message.

<img src="assets/share-logs-sheet.png" width=300/>

## Disabling logging

If you do not want logs to be forwarded over, you can disable it with the optional configuration object.

```javascript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId, {
  disableConsoleLogOverride: true,
});
```

## Forwarding logs via your own logger

Logs are passed over via an RPC command `CAPTURE_LOG`. See example below for usage.

```javascript
import {DiscordSDK} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();
discordSdk.commands.captureLog({
  level: 'log',
  message: 'This is my log message!',
});
```

### Uploading logs to support

NOTE: If you want to simply share application logs, it's recommended that you proceed with
[this workflow](#sharing-application-logs). If more information is required, your developer contact may instruct you to follow the steps below.

There is an option in the Mobile app to upload application logs to support. If you reproduce your issue, go to the User Settings view (by tapping on your avatar).
Under support, tap on "Upload debug logs to Discord Support". Please note any logs captured by log level "debug" will not be included in the uploaded logs.

![upload-logs-support](/docs/assets/upload-logs-support.png)
