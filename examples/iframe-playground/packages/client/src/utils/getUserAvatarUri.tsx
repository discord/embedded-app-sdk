interface GetUserAvatarArgs {
  userId: string;
  avatarHash?: string | null;
  guildId?: string | null;
  guildAvatarHash?: string | null;
  cdn?: string | null;
  size?: number;
}
export function getUserAvatarUri({
  userId,
  avatarHash,
  guildId,
  guildAvatarHash,
  cdn = `https://cdn.discordapp.com`,
  size = 256,
}: GetUserAvatarArgs): string {
  if (guildId != null && guildAvatarHash != null) {
    return `${cdn}/guilds/${guildId}/users/${userId}/avatars/${guildAvatarHash}.png?size=${size}`;
  }
  if (avatarHash != null) {
    return `${cdn}/avatars/${userId}/${avatarHash}.png?size=${size}`;
  }

  const defaultAvatarIndex = Math.abs(Number(userId) >> 22) % 6;
  return `${cdn}/embed/avatars/${defaultAvatarIndex}.png?size=${size}`;
}
