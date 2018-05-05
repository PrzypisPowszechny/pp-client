import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import widgets, { WidgetReducer } from './widgets/reducers';
import textSelector from './textSelector/reducers';
import annotations from './annotations/reducers';

export interface IStore {
  annotations: any;
  widgets: WidgetReducer;
  textSelector: any;
}

export default combineReducers<IStore>({
  api,
  annotations,
  widgets,
  textSelector,
});
