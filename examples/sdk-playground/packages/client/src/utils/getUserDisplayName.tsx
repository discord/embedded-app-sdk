import {IGuildsMembersRead} from '../types';
import {Types} from '@discord/embedded-app-sdk';

interface GetUserDisplayNameArgs {
  guildMember: IGuildsMembersRead | null;
  user: Partial<Types.User>;
}

export function getUserDisplayName({guildMember, user}: GetUserDisplayNameArgs) {
  if (guildMember?.nick != null && guildMember.nick !== '') return guildMember.nick;

  if (user.discriminator !== '0') return `${user.username}#${user.discriminator}`;

  if (user.global_name != null && user.global_name !== '') return user.global_name;

  return user.username;
}
