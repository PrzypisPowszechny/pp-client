import { IAuthState } from './reducers';

export const SET_AUTH_CREDENTIALS = 'SET_AUTH_CREDENTIALS';
export const REFRESH_AUTH_CREDENTIALS = 'REFRESH_AUTH_CREDENTIALS';

export function userLoggedIn(auth: IAuthState) {
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

export function userLoggedOut() {
  return {
    type: SET_AUTH_CREDENTIALS,
    payload: {},
  };
}
