import { IAuthState } from './reducers';
import dashboardMessaging from '../../../background/dashboard-messaging';

export const SET_AUTH_CREDENTIALS = 'SET_AUTH_CREDENTIALS';
export const REFRESH_AUTH_CREDENTIALS = 'REFRESH_AUTH_CREDENTIALS';

export function setAuthCredentials(auth: IAuthState | {}) {
  return {
    type: SET_AUTH_CREDENTIALS,
    payload: {
      ...auth,
    },
  };
}

export function refreshAccessToken(auth: Partial<IAuthState>) {
  return {
    type: REFRESH_AUTH_CREDENTIALS,
    payload: {
      ...auth,
    },
  };
}

export function userLoggedIn(auth) {
  return (dispatch, state) => {
    dispatch(setAuthCredentials(auth));
    dashboardMessaging.sendLoginData();
  };
}

export function userLoggedOut() {
  return (dispatch, state) => {
    dispatch(setAuthCredentials({}));
    dashboardMessaging.sendLoginData();
  };
}
