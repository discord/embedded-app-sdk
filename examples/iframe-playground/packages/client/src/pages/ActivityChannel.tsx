import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {authStore} from '../stores/authStore';
import {ISDKError, type Types} from '@discord/embedded-app-sdk';

function instanceOfSdkError(object: any): object is ISDKError {
  return 'code' in object && 'message' in object;
}

export default function CurrentGuild() {
  const [channel, setChannel] = React.useState<Types.Channel | null>(null);
  const [error, setError] = React.useState<ISDKError | null>(null);
  const auth = authStore();

  React.useEffect(() => {
    async function update() {
      if (!auth) {
        return;
      }

      const channelId = discordSdk.channelId;
      if (channelId == null) {
        return;
      }

      try {
        const newChannel = await discordSdk.commands.getChannel({channel_id: channelId});

        setChannel(newChannel);
      } catch (error: any) {
        if (instanceOfSdkError(error)) {
          setError(error);
        }
      }
    }
    update();
  }, [auth]);

  return (
    <div style={{padding: 32}}>
      <div>
        <h1>Activity Channel</h1>
        <br />
        <br />
        {channel != null ? <ReactJsonView src={channel} /> : null}
        {error != null ? (
          <div>
            <h2>Error</h2>
            <ReactJsonView src={error} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
