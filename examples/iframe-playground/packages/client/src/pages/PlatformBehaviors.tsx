import React from 'react';
import {range} from 'lodash';

import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';

const fillerArray = range(0, 40);

export default function PlatformBehaviors() {
  const [platformBehaviors, setPlatformBehaviors] = React.useState<any>(null);

  const getPlatformBehaviors = React.useCallback(async () => {
    const behaviors = await discordSdk.commands.getPlatformBehaviors();
    setPlatformBehaviors(behaviors);
  }, []);

  React.useEffect(() => {
    getPlatformBehaviors();
  }, [getPlatformBehaviors]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Platform Behaviors</h1>
        <br />
        <br />
        <button onClick={getPlatformBehaviors}>Get Platform Behaviors</button>
        <br />
        <br />
        {platformBehaviors == null ? null : <ReactJsonView src={platformBehaviors} />}
        <br />
        <br />
        {fillerArray.map((i) => (
          <div key={i}>Space {i}</div>
        ))}
        <input placeholder="test input" />
        {fillerArray.map((i) => (
          <div key={i}>Space {i}</div>
        ))}
      </div>
    </div>
  );
}
