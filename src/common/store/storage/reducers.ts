import { combineReducers } from 'redux';

import StorageSync from 'background/storage-sync';

import { USER_ACCESS_TOKEN_REFRESHED, USER_DATA_CLEARED, USER_DATA_NEW } from './actions';
import { IStorageState, IUserState } from './types';

export function auth(state: Partial<IUserState> = {}, action) {
  switch (action.type) {
    case USER_DATA_NEW:
      return {
        ...action.payload,
      };
    case USER_ACCESS_TOKEN_REFRESHED:
      const { access, refresh } = action.payload;
      return {
        ...state,
        access,
        refresh,
      };
    case USER_DATA_CLEARED:
      return {};
    default:
      return state;
  }
}

export const storageReducer = combineReducers<IStorageState>({
  auth,
});

export default StorageSync.getReducer(storageReducer);
