import {MessageInterface} from '../utils/MessageInterface';

const messageInterface = new MessageInterface();

window.addEventListener('DOMContentLoaded', async () => {
  await messageInterface.ready();

  messageInterface.sendMessage({
    command: 'SET_ACTIVITY',
    data: {
      activity: {
        details: 'Set Activity from nested iframe',
        type: 0,
        state: 'Playing',
      },
    },
  });

  const parentQueryParams = new URLSearchParams(window.parent.location.search);
  const channelId = parentQueryParams.get('channel_id');

  messageInterface.subscribe(
    'SPEAKING_START',
    ({user_id}) => {
      console.log(`"${user_id}" Just started talking`);
    },
    {channel_id: channelId}
  );

  messageInterface.subscribe(
    'SPEAKING_STOP',
    ({user_id}) => {
      console.log(`"${user_id}" Just stopped talking`);
    },
    {channel_id: channelId}
  );

  const reloadButton = document.getElementById('reload');
  reloadButton?.addEventListener('click', () => {
    console.log('reloading');
    window.location.reload();
  });
});
