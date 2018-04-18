import { combineReducers } from 'redux';
import widgets, { WidgetReducer } from './widgets/reducers';
import textSelector from './textSelector/reducers';

export interface IStore {
  widgets: WidgetReducer;
  textSelector: any;
}

export default combineReducers<IStore>({
  widgets,
  textSelector,
});
