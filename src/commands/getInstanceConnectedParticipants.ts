import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

/**
 * Gets all participants connected to the instance
 */
export const getInstanceConnectedParticipants = schemaCommandFactory(
  Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS,
);
