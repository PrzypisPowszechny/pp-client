import { combineReducers } from 'redux';
import { ITabState } from './tabs/tab/reducer';
import runtime, { IRuntimeState } from './runtime/reducer';
import tabs from './tabs/reducer';

export interface IState {
  tabs: {
    [tabId: number]: ITabState,
  };
  runtime: IRuntimeState;
}

export default combineReducers<IState>({
  tabs,
  // runtime, //todo uncomment
});
