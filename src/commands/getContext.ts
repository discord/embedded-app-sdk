import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns where and how the app was launched: the embedded surface (with its channel and guild, when known),
 * launch details such as the interaction or referrer it came from, and the client platform.
 *
 * `surface.type` is `-1` for a surface type this version of the SDK doesn't know about.
 */
export const getContext = schemaCommandFactory(Command.GET_CONTEXT);
