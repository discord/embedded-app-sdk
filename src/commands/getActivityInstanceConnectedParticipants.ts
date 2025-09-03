import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const getActivityInstanceConnectedParticipants = schemaCommandFactory(
  Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS,
);
