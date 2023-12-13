import type {AsyncReturnType} from 'type-fest';
import {discordSdk} from './discordSdk';
import {Client, Room} from 'colyseus.js';
import {State} from '../../server/src/entities/State';

export type TAuthenticateResponse = AsyncReturnType<typeof discordSdk.commands.authenticate>;
export interface IColyseus {
  room: Room<State>;
  client: Client;
}
export type TAuthenticatedContext = TAuthenticateResponse & IGuildsReadInfo & IColyseus;

export interface IGuildsMembersRead {
  roles: string[];
  nick: string | null;
  avatar: string | null;
  premium_since: string | null;
  joined_at: string;
  is_pending: boolean;
  pending: boolean;
  communication_disabled_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
  };
  mute: boolean;
  deaf: boolean;
}

export interface IGuildsReadInfo {
  nick: string | null;
  /** We're going to take the user info and user's guild info to get either the user's guild avatar image, the user's image, or the user's default avatar in the right color  */
  avatarUri: string;
}
