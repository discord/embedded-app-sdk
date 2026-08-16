import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const stopSpatialVoiceSession = schemaCommandFactory(Command.STOP_SPATIAL_VOICE_SESSION);
