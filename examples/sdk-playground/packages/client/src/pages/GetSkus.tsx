import React from 'react';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

export default function GetSkus() {
  const [skus, setSkus] = React.useState<Awaited<ReturnType<typeof discordSdk.commands.getSkus>> | null>(null);

  React.useEffect(() => {
    async function getSkus() {
      const skus = await discordSdk.commands.getSkus();
      setSkus(skus);
    }
    getSkus();
  }, []);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Get Skus</h1>
        <br />
        <br />
        {skus == null ? null : <ReactJsonView src={skus} />}
      </div>
    </div>
  );
}
