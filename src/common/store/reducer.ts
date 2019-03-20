import { combineReducers } from 'redux';
import { ITabState } from './tabs/tab/reducer';
import runtime, { IRuntimeState } from './runtime/reducer';
import tabs from './tabs/reducer';
import { IUserState, IStorageState } from './storage/types';
import storage from './storage/reducers';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  // runtime: IRuntimeState;
  storage: IStorageState;
}

export default combineReducers<IState>({
  tabs,
  // runtime, //todo uncomment
  storage,
});
