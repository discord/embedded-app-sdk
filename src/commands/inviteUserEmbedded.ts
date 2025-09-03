import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const inviteUserEmbedded = schemaCommandFactory(Command.INVITE_USER_EMBEDDED);
