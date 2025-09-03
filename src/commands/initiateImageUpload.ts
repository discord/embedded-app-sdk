import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const initiateImageUpload = schemaCommandFactory(Command.INITIATE_IMAGE_UPLOAD);
