import { RivetClient } from "@rivet-gg/api";

export const RIVET = new RivetClient({
    environment: process.env.RIVET_API_ENDPOINT,
    token: process.env.RIVET_TOKEN,
});

export async function ready() {
    try {
        // Notify Rivet that this lobby is ready to accept players
        return await RIVET.matchmaker.lobbies.ready();
    } catch (e) {
        console.log(":(", e);
        process.exit(1);
    }
}

export async function playerConnected(playerToken: string) {
    // Tell Rivet that the player has connected.
    return await RIVET.matchmaker.players.connected({ playerToken });
}

export async function playerDisconnected(playerToken: string) {
    // Tell Rivet that the player has connected.
    return await RIVET.matchmaker.players.disconnected({ playerToken });
}
