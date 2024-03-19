// Import the SDK
import { DiscordSDK, Types } from "@discord/embedded-app-sdk";
import ConnectionTarget from "./matchmaker";

// Instantiate the SDK
const discordSdk = new DiscordSDK(process.env.DISCORD_CLIENT_ID!);
export const instanceId = discordSdk.instanceId;

export async function setupDiscordSdk() {
	await discordSdk.ready();
	await discordSdk.commands.encourageHardwareAcceleration();
	return await authorizeDiscord();
}

export async function authorizeDiscord() {
	// Authorize with Discord Client
	const { code } = await discordSdk.commands.authorize({
		client_id: process.env.DISCORD_CLIENT_ID!,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: [
			"identify",
		],
	});

	console.log("Authorized Discord");

	return code;
}

export async function authenticateDiscord(target: ConnectionTarget, authCode: string) {
	const splitHost = target.port.hostname.split(".");
	const path = `/ws/${splitHost[2]}/${splitHost[0]}`;

	const response = await fetch(`${path}/api/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			code: authCode,
		}),
	});
	const { access_token } = await response.json();

	// Authenticate with Discord client (using the access_token)
	const auth = await discordSdk.commands.authenticate({
		access_token,
	});

	if (auth == null) {
		throw new Error("Authenticate command failed");
	}

	return auth;
}
