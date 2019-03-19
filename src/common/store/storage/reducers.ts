import { combineReducers } from 'redux';
import { USER_DATA_NEW, USER_DATA_CLEARED, USER_ACCESS_TOKEN_REFRESHED } from './actions';
import StorageSync from 'background/storage-sync';

export interface IUserAuth {
  access: string;
  refresh: string;
}

export interface IUserProperties {
  userId: string;
}

export type IUserState = IUserAuth & IUserProperties;

export interface IStorageState {
  auth: IUserState;
}

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
