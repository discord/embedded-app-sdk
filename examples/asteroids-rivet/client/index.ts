import { getPlayerInputForMouseLocation } from "../shared/player";
import { resizeClient } from "./screensize";
import Client, {
    ClientState,
    getClientState,
    initClient,
    respawn,
    setPlayerInput,
    setup,
    startClientDrawloop,
    tryShoot,
} from "./state";

function createResizeEventListener(client: Client) {
    window.addEventListener("resize", () => resizeClient(client));
}

function createInputEventListener(client: Client) {
    window.addEventListener("mousedown", async () => {
        switch (getClientState(client)) {
            case ClientState.INITIAL:
                await setup(client);
                console.log("Connection established");
                break;

            case ClientState.DEAD:
                await respawn(client);
                console.log("Connection established");
                break;

            case ClientState.PLAYING:
                await tryShoot(client);
                break;
        }
    });
    window.addEventListener("mousemove", async (ev) => {
        const playing = getClientState(client) === ClientState.PLAYING;

        if (playing) {
            await setPlayerInput(client, getPlayerInputForMouseLocation(ev.clientX, ev.clientY));
        }
    });
}

window.addEventListener("load", () => {
    const client = initClient("game");

    const _stopDrawLoop = startClientDrawloop(client);

    createInputEventListener(client);
    createResizeEventListener(client);
});
