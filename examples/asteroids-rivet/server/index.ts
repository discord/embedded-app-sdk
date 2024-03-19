import Connection, { checkForDeath, checkForSever, createConnection } from "./connection";
import { ready as lobbyReady } from "./rivet";

import { ServerOptions, Server } from "socket.io";
import { ServerSideSocketServer, serverConfig } from "@shared/socket";
import {
    asteroids,
    ensureAsteroidCount,
    newBulletHellGame,
    newRandomGame,
    players,
    updateGame,
} from "../shared/gamestate";

import { configDotenv } from "dotenv";
import { resolve } from "path";
import { applyPlayerInput } from "../shared/player";
configDotenv({ path: resolve(process.cwd(), ".env") });
configDotenv({ path: resolve(process.cwd(), ".dev.env") });

const gameModeName = process.env.RIVET_GAME_MODE_NAME ?? "default";

function getGameModeGame() {
    if (gameModeName === "default") return newRandomGame({ x: 2500, y: 2500 }, 45);
    if (gameModeName === "bullet-hell") return newBulletHellGame({ x: 2500, y: 2500 }, 200);
    throw new Error("Invalid game mode name.");
}

console.log(`Starting ${gameModeName} lobby...`);

const globalGame = getGameModeGame();

const PHYSICS_UPDATES_PER_SECOND = 60;
const PHYSICS_UPDATES_PER_MESSAGE = 6;
const PORT = process.env.WEBSOCKET_PORT ? parseInt(process.env.WEBSOCKET_PORT) : 3000;
const connections = new Set<Connection>();

const socketServer: ServerSideSocketServer = new Server(PORT, serverConfig);

socketServer.on("connection", (sock) => {
    const takenNames = new Set<string>();
    for (const connection of connections) takenNames.add(connection.lifetime.playerName);
    connections.add(createConnection(sock, globalGame, takenNames));
});

console.log("Websocket server initialized");

const dt = 1 / PHYSICS_UPDATES_PER_SECOND;
const dtUpdate = dt * PHYSICS_UPDATES_PER_MESSAGE;

setInterval(() => {
    for (const connection of connections) {
        if (!connection.stateful.stopped) {
            connection.lifetime.socket.emit("update", {
                state: globalGame,
                timestamp: Date.now(),
            });
        }
    }
}, 1000 * dtUpdate);

setInterval(() => {
    for (const player of players(globalGame)) {
        applyPlayerInput(player, dt);
    }
    updateGame(globalGame, dt, "");
    if (globalGame.targetAsteroids === 0 && asteroids(globalGame).length === 0) {
        for (const connection of connections) {
            connection.lifetime.socket.emit("stopUpdates", {});
            connection.lifetime.socket.disconnect();
        }
        console.log("Bullet hell won");
        process.exit(0);
    }
    ensureAsteroidCount(globalGame);

    for (const connection of connections) {
        // If the client has left, then delete the connection
        if (connection.stateful.disconnected) {
            connections.delete(connection);
            continue;
        }
        checkForDeath(connection);
        checkForSever(connection);
    }
}, 1000 * dt);

console.log("Lobby ready");
lobbyReady().then(() => console.log("Lobby opened in Rivet"));
