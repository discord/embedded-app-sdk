// Import the SDK
import { DiscordSDK } from "@discord/embedded-app-sdk";

// Instantiate the SDK
const discordSdk = new DiscordSDK(process.env.DISCORD_CLIENT_ID);
export const instanceId = discordSdk.instanceId;

export async function setupDiscordSdk() {
	await discordSdk.ready();
	await discordSdk.commands.encourageHardwareAcceleration();
}
