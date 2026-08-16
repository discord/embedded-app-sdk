import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const suspendSpatialVoiceSession = schemaCommandFactory(Command.SUSPEND_SPATIAL_VOICE_SESSION);
