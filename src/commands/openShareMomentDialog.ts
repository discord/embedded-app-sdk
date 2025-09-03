import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const openShareMomentDialog = schemaCommandFactory(Command.OPEN_SHARE_MOMENT_DIALOG);
