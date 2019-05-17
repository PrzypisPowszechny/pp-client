import { combineReducers } from 'redux';

import { IStorageSyncState } from 'background/storage-sync';

import runtime from './runtime/reducer';
import { IRuntimeState } from './runtime/types';
import storage from './storage/reducers';
import { IStorageState } from './storage/types';
import tabs from './tabs/reducer';
import { ITabState } from './tabs/tab/reducer';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  runtime: IRuntimeState;
  storage: IStorageSyncState<IStorageState>;
}

export default combineReducers<IState>({
  tabs,
  runtime,
  storage,
});
