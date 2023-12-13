import * as React from 'react';
import {Events} from '@discord/embedded-app-sdk';
import {Player as PlayerState} from '../../../server/src/entities/Player';

import {useAuthenticatedContext} from '../hooks/useAuthenticatedContext';
import {discordSdk} from '../discordSdk';

const PlayersContext = React.createContext<PlayerState[]>([]);

export function PlayersContextProvider({children}: {children: React.ReactNode}) {
  const players = usePlayersContextSetup();

  return <PlayersContext.Provider value={players}>{children}</PlayersContext.Provider>;
}

export function usePlayers() {
  return React.useContext(PlayersContext);
}

/**
 * This hook sets up listeners for each player so that their state is kept up to date and can be consumed elsewhere in the app
 * One improvement worth considering is using a map instead of an array
 */
function usePlayersContextSetup() {
  const [players, setPlayers] = React.useState<PlayerState[]>([]);

  const authenticatedContext = useAuthenticatedContext();

  React.useEffect(() => {
    try {
      authenticatedContext.room.state.players.onAdd = function (player, _key) {
        setPlayers((players) => [...players, player]);
        player.onChange = function (changes) {
          setPlayers((players) =>
            players.map((p) => {
              if (p.userId !== player.userId) {
                return p;
              }
              changes.forEach(({field, value}) => {
                // @ts-expect-error
                p[field] = value;
              });
              return p;
            })
          );
        };
      };

      authenticatedContext.room.state.players.onRemove = function (player, _key) {
        setPlayers((players) => [...players.filter((p) => p.userId !== player.userId)]);
      };

      authenticatedContext.room.onLeave((code) => {
        console.log("You've been disconnected.", code);
      });
    } catch (e) {
      console.error("Couldn't connect:", e);
    }
  }, [authenticatedContext.room]);

  React.useEffect(() => {
    function handleSpeakingStart({user_id}: {user_id: string}) {
      if (authenticatedContext.user.id === user_id) {
        authenticatedContext.room.send('startTalking');
      }
    }
    function handleSpeakingStop({user_id}: {user_id: string}) {
      if (authenticatedContext.user.id === user_id) {
        authenticatedContext.room.send('stopTalking');
      }
    }

    discordSdk.subscribe(Events.SPEAKING_START, handleSpeakingStart, {channel_id: discordSdk.channelId});
    discordSdk.subscribe(Events.SPEAKING_STOP, handleSpeakingStop, {channel_id: discordSdk.channelId});
    return () => {
      discordSdk.unsubscribe(Events.SPEAKING_START, handleSpeakingStart);
      discordSdk.unsubscribe(Events.SPEAKING_STOP, handleSpeakingStop);
    };
  }, [authenticatedContext]);

  return players;
}
