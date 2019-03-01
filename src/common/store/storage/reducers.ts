import { combineReducers } from 'redux';
import { REFRESH_AUTH_CREDENTIALS, SET_AUTH_CREDENTIALS } from './actions';
import StorageSync from 'background/storage-sync';

export interface IAuthState {
  userId: string;
  access: string;
  refresh: string;
}

export interface IStorageState {
  auth: IAuthState;
}

export function auth(state: Partial<IAuthState> = {}, action) {
  switch (action.type) {
    case SET_AUTH_CREDENTIALS:
      return {
        ...action.payload,
      };
    case REFRESH_AUTH_CREDENTIALS:
      return {
        userId: state.userId,
        ...action.payload,
      };
    default:
      return state;
  }
}

export const storageReducer = combineReducers<IStorageState>({
  auth,
});

export default StorageSync.getReducer(storageReducer);
