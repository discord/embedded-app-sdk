import React from 'react';
import discordSdk from '../discordSdk';

export default function EncourageHardwareAcceleration() {
  const [hwAccEnabled, setHWAccEnabled] = React.useState<boolean | null>(null);

  const doEncourageHardwareAcceleration = async () => {
    const {enabled} = await discordSdk.commands.encourageHardwareAcceleration();
    setHWAccEnabled(enabled === true);
  };
  const enabledString = hwAccEnabled === null ? 'unknown' : hwAccEnabled === true ? 'Yes' : 'No';

  return (
    <div style={{padding: 32}}>
      <h1>Is Hardware Acceleration Enabled?</h1>
      <h2>{enabledString}</h2>
      <button onClick={doEncourageHardwareAcceleration}>Click here to Encourage Hardware Acceleration!</button>
    </div>
  );
}
