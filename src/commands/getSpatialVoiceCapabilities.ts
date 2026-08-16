import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getSpatialVoiceCapabilities = schemaCommandFactory(Command.GET_SPATIAL_VOICE_CAPABILITIES);
