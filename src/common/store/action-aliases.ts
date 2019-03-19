import { reduxJsonApiAliases } from './tabs/tab/api/action-aliases';
import { userLoggedIn, userLoggedOut } from './storage/actions';
import { aliasActionToTabMarkedThunk } from './action-utils';

export const authAliases = {
  userLoggedInAlias: aliasActionToTabMarkedThunk(userLoggedIn),
  userLoggedOutAlias: aliasActionToTabMarkedThunk(userLoggedOut),
};

export default {
  ...reduxJsonApiAliases,
  ...authAliases,
};
