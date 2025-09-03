import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Opens the Share Moment Dialog in the user's client, allowing them to share the media at mediaUrl as a message.
 *
 * @param {string} mediaUrl - a Discord CDN URL for the piece of media to be shared.
 * @returns {Promise<void>}
 */
export const openShareMomentDialog = schemaCommandFactory(Command.OPEN_SHARE_MOMENT_DIALOG);
