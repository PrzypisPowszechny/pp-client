import { aliasActionToTabMarkedThunk } from './action-utils';
import { accessTokenRefresh, userLoggedIn, userLoggedOut } from './storage/actions-background';
import { reduxJsonApiAliases } from './tabs/tab/api/action-aliases';

export const authAliases = {
  userLoggedInAlias: aliasActionToTabMarkedThunk(userLoggedIn),
  accessTokenRefreshAlias: aliasActionToTabMarkedThunk(accessTokenRefresh),
  userLoggedOutAlias: aliasActionToTabMarkedThunk(userLoggedOut),
};

export default {
  ...reduxJsonApiAliases,
  ...authAliases,
};
