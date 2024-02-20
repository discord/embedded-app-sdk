import React from 'react';
import discordSdk from '../discordSdk';
import {Common, Events, EventPayloadData} from '@discord/embedded-app-sdk';

export default function OrientationUpdates() {
  const [orientationString, setOrientationString] = React.useState<string>('');

  const updateOrientation = React.useCallback<(u: EventPayloadData<'ORIENTATION_UPDATE'>) => void>((update) => {
    const screenOrientation = update.screen_orientation;
    let orientationStr;
    switch (screenOrientation) {
      case Common.OrientationTypeObject.PORTRAIT:
        orientationStr = 'PORTRAIT';
        break;
      case Common.OrientationTypeObject.LANDSCAPE:
        orientationStr = 'LANDSCAPE';
        break;
      default:
        orientationStr = 'UNHANDLED';
        break;
    }

    setOrientationString(orientationStr);
  }, []);

  React.useEffect(() => {
    discordSdk.subscribe(Events.ORIENTATION_UPDATE, updateOrientation);
    return () => {
      discordSdk.unsubscribe(Events.ORIENTATION_UPDATE, updateOrientation);
    };
  }, [updateOrientation]);

  return (
    <div style={{padding: 32}}>
      <h1>Orientation Updates</h1>
      <p style={{marginTop: 16}}>app orientation: {orientationString}</p>
    </div>
  );
}
