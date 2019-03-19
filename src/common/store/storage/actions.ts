import { IUserAuth, IUserState } from './reducers';
import dashboardMessaging from '../../../background/dashboard-messaging';

export const USER_DATA_NEW = 'USER_DATA_NEW';
export const USER_DATA_CLEARED = 'USER_LOGGED_OUT';
export const USER_ACCESS_TOKEN_REFRESHED = 'REFRESH_AUTH_CREDENTIALS';

export function userDataNew(payload: IUserState) {
  return {
    type: USER_DATA_NEW,
    payload,
  };
}

export function userTokensRefreshed(payload: IUserAuth) {
  return {
    type: USER_ACCESS_TOKEN_REFRESHED,
    payload,
  };
}

export function userDataCleared() {
  return {
    type: USER_DATA_CLEARED,
  };
}

export function userLoggedIn(auth) {
  return (dispatch, state) => {
    dispatch(userDataNew(auth));
    dashboardMessaging.sendLoginData();
  };
}

export function accessTokenRefresh(auth) {
  return (dispatch, state) => {
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
