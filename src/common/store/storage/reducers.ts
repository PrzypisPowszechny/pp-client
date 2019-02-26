import { combineReducers } from 'redux';
import { SET_AUTH_CREDENTIALS } from './actions';

export interface IAuthState {
  userId: string;
  access: string;
  refresh: string;
}

export interface IStorageState {
  auth: IAuthState;
}

export function auth(state = {}, action) {
  switch (action.type) {
    case SET_AUTH_CREDENTIALS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers<IStorageState>({
  auth,
});
