import {schemaCommandFactory} from '../utils/commandFactory';
import {Command} from '../generated/schemas';

export const inviteUserEmbedded = schemaCommandFactory(Command.INVITE_USER_EMBEDDED);
