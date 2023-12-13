import React from 'react';
import discordSdk from '../discordSdk';
import {RPCCloseCodes} from '@discord/embedded-app-sdk';

export default function Home() {
  const onCloseClick = () => {
    discordSdk.close(RPCCloseCodes.CLOSE_NORMAL, 'User closed!');
  };
  return (
    <div style={{padding: 32}}>
      Welcome to the iframe playground. This application is for testing rpc and api calls inside of a Discord Activity,
      embedded in an iframe.
      <div>
        <button onClick={onCloseClick}>Click here to close.</button>
      </div>
    </div>
  );
}
