import { reduxJsonApiAliases } from './tabs/tab/api/action-aliases';
import { accessTokenRefresh, userLoggedIn, userLoggedOut } from './storage/actions-background';
import { aliasActionToTabMarkedThunk } from './action-utils';

export const authAliases = {
  userLoggedInAlias: aliasActionToTabMarkedThunk(userLoggedIn),
  accessTokenRefreshAlias: aliasActionToTabMarkedThunk(accessTokenRefresh),
  userLoggedOutAlias: aliasActionToTabMarkedThunk(userLoggedOut),
};

export default {
  ...reduxJsonApiAliases,
  ...authAliases,
};
