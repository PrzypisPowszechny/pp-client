import { IUserAuth, IUserState } from './types';

export const USER_DATA_NEW = 'USER_DATA_NEW';
export const USER_DATA_CLEARED = 'USER_DATA_CLEARED';
export const USER_ACCESS_TOKEN_REFRESHED = 'USER_ACCESS_TOKEN_REFRESHED';

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
