import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const startSpatialVoiceSession = schemaCommandFactory(Command.START_SPATIAL_VOICE_SESSION);
