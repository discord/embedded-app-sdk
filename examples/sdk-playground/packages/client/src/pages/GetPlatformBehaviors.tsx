import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetPlatformBehaviors() {
  const [platformBehaviors, setPlatformBehaviors] = React.useState<Awaited<
    ReturnType<typeof discordSdk.commands.getPlatformBehaviors>
  > | null>(null);

  React.useEffect(() => {
    async function getPlatformBehaviors() {
      const platformBehaviors = await discordSdk.commands.getPlatformBehaviors();
      setPlatformBehaviors(platformBehaviors);
    }
    getPlatformBehaviors();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Platform Behaviors</h1>
        <br />
        <br />
        {platformBehaviors == null ? null : <ReactJsonView src={platformBehaviors} />}
      </div>
    </div>
  );
}
