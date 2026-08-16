import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const updateSpatialVoiceSession = schemaCommandFactory(Command.UPDATE_SPATIAL_VOICE_SESSION);
