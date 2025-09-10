import {Command} from '../generated/schemas';
import {schemaCommandFactory} from '../utils/commandFactory';

export const requestProxyTicketRefresh = schemaCommandFactory(Command.REQUEST_PROXY_TICKET_REFRESH);
