import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const resumeSpatialVoiceSession = schemaCommandFactory(Command.RESUME_SPATIAL_VOICE_SESSION);
