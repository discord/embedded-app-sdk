# Application Orientation

## Locking Application Orientation

This SDK provides APIs for locking the application to specific orientations. The possible lock states are `UNLOCKED`, `PORTRAIT`, and `LANDSCAPE`. `lock_state` is the default lock state, and it affects the app orientation when the application is focused. `picture_in_picture_lock_state` determines the PIP aspect ratio, and `grid_lock_state` determines the grid tile aspect ratio for the application. When `picture_in_picture_lock_state` is not set, the application PIP falls back to `lock_state` to determine the aspect ratio. When `grid_lock_state` is not set, the application grid tile falls back to `picture_in_picture_lock_state` to determine its aspect ratio, and if `picture_in_picture_lock_state`is not set, it uses `lock_state`.

Calling `setOrientationLockState` with an `undefined` or omitted value for `picture_in_picture_lock_state` or `grid_lock_state` will not change the corresponding lock states for the application. Calling `setOrientationLockState` with a null value for `picture_in_picture_lock_state` or `grid_lock_state` will clear the application's corresponding lock states such that those layout modes will use the fallback lock states.

```javascript
import {DiscordSDK, Common} from '@discord/embedded-app-sdk';
const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();

// Set a default lock state
discordSdk.commands.setOrientationLockState({lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE});

// or set both a default lock state and a picture-in-picture lock state
discordSdk.commands.setOrientationLockState({
  lock_state: Common.OrientationLockStateTypeObject.PORTRAIT,
  picture_in_picture_lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE,
  grid_lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE,
});
```

### Configuring Default Orientation Lock State Through the Developer Portal

It's also possible to configure an application with a default orientation lock state via the Developer Portal. Using this method, the Discord app will apply the orientation lock when launching the application before the SDK has been initialized. This can create a smoother application launch flow where the application starts in the correct orientation rather than switching to the correct orientation after some delay after the application requests an orientation lock via the SDK. The Developer Portal supports setting a different default orientation lock states for phones versus tablets.

![default-orientation-lock-state](/docs/assets/default_orientation_lock_state.png)

## Subscribing to Screen Orientation Updates

To listen to the screen orientation (which is sometimes different from the physical device orientation), subscribe to the `ORIENTATION_UPDATE` event. Discord will publish the current orientation upon event subscription, and it'll also publish any orientation changes that happen afterward.

```javascript
const handleOrientationUpdate = (update: {screen_orientation: number}) => {
  switch (update.screen_orientation) {
      case Common.OrientationTypeObject.PORTRAIT:
        ...
      case Common.OrientationTypeObject.LANDSCAPE:
        ...
      default:
        ...
    }
}

discordSdk.subscribe('ORIENTATION_UPDATE', handleOrientationUpdate);
```
