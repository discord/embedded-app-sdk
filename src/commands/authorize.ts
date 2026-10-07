import {Command} from '../generated/schemas';
import {OAuthScopes} from '../schema/types';
import {schemaCommandFactory} from '../utils/commandFactory';

export interface AuthorizeInput {
  client_id: string;
  scope: OAuthScopes[];
  response_type?: 'code';
  code_challenge?: string;
  state?: string;
  prompt?: 'none';
  code_challenge_method?: 'S256';
}

/**
 * Should be called directly after a `ready` payload is received from the
 * Discord client. It includes a list of all scopes that your activity would
 * like to be authorized to use. If the user does not yet have a valid token
 * for all scopes requested, this command will open an OAuth modal. Once an
 * authorized token is available, it will be returned in the command response.
 */
export const authorize = schemaCommandFactory<Command.AUTHORIZE, AuthorizeInput>(Command.AUTHORIZE);
