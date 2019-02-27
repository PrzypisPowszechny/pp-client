import { combineReducers } from 'redux';
import { SET_AUTH_CREDENTIALS } from './actions';
import StorageSync from 'background/storage-sync';

export interface IAuthState {
  userId: string;
  access: string;
  refresh: string;
}

export interface IStorageState {
  auth: IAuthState;
}

const initialState = {
  loggedIn: false,
}

export function auth(state = {}, action) {
  switch (action.type) {
    case SET_AUTH_CREDENTIALS:
      const loggedIn = action.payload.userId !== undefined;
      return {
        loggedIn,
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
