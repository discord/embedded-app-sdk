import {initializeSdk} from './utils/initializeSdk';
import type {MessageData} from './utils/types';

window.addEventListener('DOMContentLoaded', setupParentIframe);

export async function setupParentIframe() {
  const discordSdk = await initializeSdk();
  notifyChildParentIsReady();

  async function handleMessage({data: messageData}: MessageEvent<MessageData>) {
    // Bail out if messageData is not an "{}" object
    if (typeof messageData !== 'object' || Array.isArray(messageData) || messageData === null) {
      return;
    }
    const {nonce, event, command, data, args} = messageData;

    function handleSubscribeEvent(eventData) {
      getChildIframe().contentWindow?.postMessage(
        {
          event,
          command: 'DISPATCH',
          data: eventData,
        },
        '*'
      );
    }

    switch (command) {
      case 'NOTIFY_CHILD_IFRAME_IS_READY': {
        notifyChildParentIsReady();
        break;
      }
      case 'SUBSCRIBE': {
        if (event == null) {
          throw new Error('SUBSCRIBE event is undefined');
        }

        discordSdk.subscribe(event, handleSubscribeEvent, args);
        break;
      }
      case 'UNSUBSCRIBE': {
        if (event == null) {
          throw new Error('UNSUBSCRIBE event is undefined');
        }
        discordSdk.unsubscribe(event, handleSubscribeEvent);
        break;
      }
      case 'SET_ACTIVITY': {
        const reply = await discordSdk.commands.setActivity(data as any);
        getChildIframe().contentWindow?.postMessage({nonce, event, command, data: reply}, '*');
        break;
      }
    }
  }

  window.addEventListener('message', handleMessage);
}

function getChildIframe(): HTMLIFrameElement {
  const iframe = document.getElementById('child-iframe') as HTMLIFrameElement | null;
  if (iframe == null) {
    throw new Error('Child iframe not found');
  }
  return iframe;
}

function notifyChildParentIsReady() {
  const iframe = getChildIframe();
  iframe.contentWindow?.postMessage(
    {
      event: 'READY',
      command: 'DISPATCH',
    },
    '*'
  );
}
