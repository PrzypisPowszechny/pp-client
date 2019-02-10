import { combineReducers } from 'redux';
import tab, { ITabState } from './tabs/tab/reducer';
import tabs from './tabs/reducer';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  // TODO: runtime: IRuntimeState;
}

export default combineReducers<IState>({
  tabs,
  // TODO: runtime
});
