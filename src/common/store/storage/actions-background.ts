import { userDataCleared, userDataNew, userTokensRefreshed } from './actions';
import dashboardMessaging from '../../../background/dashboard-messaging';

/*
 * It's convenient to set apart background actions in a different file
 * Background-specific modules can be freely imported
 */
export function userLoggedIn(auth) {
  return (dispatch, state) => {
    dispatch(userDataNew(auth));
    dashboardMessaging.sendLoginData();
  };
}

export function accessTokenRefresh(auth) {
  return (dispatch, state) => {
    console.log('refresh');
    dispatch(userTokensRefreshed(auth));
    dashboardMessaging.sendLoginData();
  };
}

export function userLoggedOut() {
  return (dispatch, state) => {
    dispatch(userDataCleared());
    dashboardMessaging.sendLoginData();
  };
}
