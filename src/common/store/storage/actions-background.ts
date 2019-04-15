import { userDataCleared, userDataNew, userTokensRefreshed } from './actions';
import dashboardMessaging from '../../../background/dashboard-messaging';

/*
 * It's convenient to set apart background actions in a different file
 * Background-specific modules can be freely imported
 */
export function userLoggedIn(auth) {
  return (dispatch, state) => {
    dispatch(userDataNew(auth));
  };
}

export function accessTokenRefresh(auth) {
  return (dispatch, state) => {
    dispatch(userTokensRefreshed(auth));
  };
}

export function userLoggedOut() {
  return (dispatch, state) => {
    dispatch(userDataCleared());
  };
}
