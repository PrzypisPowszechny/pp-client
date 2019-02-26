import { IAuthState } from './reducers';

export const SET_AUTH_CREDENTIALS = 'SET_AUTH_CREDENTIALS';

export function userLoggedIn(auth: IAuthState) {
  return {
    type: SET_AUTH_CREDENTIALS,
    payload: {
      ...auth,
    },
  };
}
