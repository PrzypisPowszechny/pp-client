import { combineReducers } from 'redux';

import tabs from './tabs/reducer';
import { ITabState } from './tabs/tab/reducer';

import runtime from './runtime/reducer';
import { IRuntimeState } from './runtime/types';

import { IUserState, IStorageState } from './storage/types';
import storage from './storage/reducers';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  runtime: IRuntimeState;
  storage: IStorageState;
}

export default combineReducers<IState>({
  tabs,
  runtime,
  storage,
});
