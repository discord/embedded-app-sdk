import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getSpatialVoiceParticipants = schemaCommandFactory(Command.GET_SPATIAL_VOICE_PARTICIPANTS);
