import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import widgets, { WidgetReducer } from './widgets/reducers';
import textSelector from './textSelector/reducers';
import {AnnotationAPIModel} from 'api/annotations';

export interface IStore {
  api: {
    annotations: { data: AnnotationAPIModel[] };
  };
  widgets: WidgetReducer;
  textSelector: any;
}

export default combineReducers<IStore>({
  api,
  widgets,
  textSelector,
});
