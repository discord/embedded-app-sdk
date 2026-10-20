import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Returns the channels in the provided guild id.
 * Must be the current guild, and the app's bot must be installed in it.
 */
export const getChannels = schemaCommandFactory(Command.GET_CHANNELS);
