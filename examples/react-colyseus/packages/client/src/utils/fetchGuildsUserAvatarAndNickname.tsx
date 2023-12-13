import {discordSdk} from '../discordSdk';
import type {TAuthenticateResponse, IGuildsMembersRead, IGuildsReadInfo} from '../types';

/**
 * This helper function is used to fetch the user's guild-specific avatar and nickname
 * We're going to return either the guild specific values, and fallback to the user's
 * default values, if no guild-specific values are available
 */
export function fetchGuildsUserAvatarAndNickname(authenticatedUser: TAuthenticateResponse): Promise<IGuildsReadInfo> {
  return fetch(`/discord/api/users/@me/guilds/${discordSdk.guildId}/member`, {
    method: 'get',
    headers: {Authorization: `Bearer ${authenticatedUser.access_token}`},
  })
    .then((j) => j.json())
    .then((guildsMembersRead: IGuildsMembersRead) => {
      const reply: IGuildsReadInfo = {
        nick: getUserNickName(guildsMembersRead.nick, authenticatedUser),
        avatarUri: getUserAvatarUri(guildsMembersRead.avatar, authenticatedUser),
      };
      return reply;
    })
    .catch(() => {
      const fallbackObject: IGuildsReadInfo = {
        nick: getUserNickName(null, authenticatedUser),
        avatarUri: getUserAvatarUri(null, authenticatedUser),
      };
      return fallbackObject;
    });
}

function getUserAvatarUri(guildAvatarHash: string | null, authenticatedUser: TAuthenticateResponse) {
  // Get the user's guild-specific avatar uri
  // If none, fall back to the user profile avatar
  // If no main avatar, use a default avatar
  if (guildAvatarHash != null) {
    return `https://cdn.discordapp.com/guilds/${discordSdk.guildId}/users/${authenticatedUser.user.id}/avatars/${guildAvatarHash}.png?size=256`;
  }
  if (authenticatedUser.user.avatar != null) {
    return `https://cdn.discordapp.com/avatars/${authenticatedUser.user.id}/${authenticatedUser.user.avatar}.png?size=256`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(authenticatedUser.user.discriminator) % 5}.png`;
}

function getUserNickName(nickName: string | null, authenticatedUser: TAuthenticateResponse) {
  return nickName ?? `${authenticatedUser.user.username}${authenticatedUser.user.discriminator}`;
}
