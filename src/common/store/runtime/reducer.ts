import { combineReducers } from 'redux';
import { SET_AUTH_PROC_STAGE } from './actions';
import { IAuthProcState, IRuntimeState } from './types';

export function authProc(
    state: IAuthProcState = { stage: null }, action: {type: string, payload: IAuthProcState},
): IAuthProcState {
  switch (action.type) {
    case SET_AUTH_PROC_STAGE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers<IRuntimeState>({
  authProc,
  // user, // todo
});
