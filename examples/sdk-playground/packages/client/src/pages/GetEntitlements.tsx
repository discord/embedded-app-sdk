import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetEntitlements() {
  const [entitlements, setEntitlements] = React.useState<Awaited<
    ReturnType<typeof discordSdk.commands.getEntitlements>
  > | null>(null);

  React.useEffect(() => {
    async function getEntitlements() {
      const entitlements = await discordSdk.commands.getEntitlements();
      setEntitlements(entitlements);
    }
    getEntitlements();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Entitlements</h1>
        <br />
        <br />
        {entitlements == null ? null : <ReactJsonView src={entitlements} />}
      </div>
    </div>
  );
}
