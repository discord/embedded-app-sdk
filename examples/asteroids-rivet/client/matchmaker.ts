import { Rivet, RivetClient } from "@rivet-gg/api";

export default interface ConnectionTarget {
    port: Rivet.matchmaker.JoinPort;
    player: Rivet.matchmaker.JoinPlayer;
    lobbyId: string;
}

export const RIVET = new RivetClient({
    // @ts-ignore
    environment: process.env.RIVET_API_ENDPOINT,
    // @ts-ignore
    token: process.env.RIVET_TOKEN,
});

export async function getConnectionTarget(gameMode: string): Promise<ConnectionTarget> {
    const res = await RIVET.matchmaker.lobbies.find({ gameModes: [gameMode] });
    const port = res.ports.default;
    const player = res.player;
    const lobbyId = res.lobby.lobbyId;

    if (!port) throw new Error("Matchmaker did not provide a port to connect to.");

    return { port, player, lobbyId };
}

export async function joinLobby(target: ConnectionTarget) {
    return await RIVET.matchmaker.lobbies.join({ lobbyId: target.lobbyId });
}
