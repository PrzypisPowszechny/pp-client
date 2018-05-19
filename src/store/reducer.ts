import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import widgets, { WidgetReducer } from './widgets/reducers';
import textSelector from './textSelector/reducers';
import { AnnotationAPIModel, AnnotationUpvoteAPIModel } from 'api/annotations';

export interface IStore {
  api: {
    annotations: { data: AnnotationAPIModel[] };
    annotationUpvotes: { data: AnnotationUpvoteAPIModel[] };
  };
  widgets: WidgetReducer;
  textSelector: any;
}

// Because redux-json-api is not prepared to safely execute all actions
// unless given type has already been loaded into the store with readEndpoint,
// we initialize all types manually to be able to call eg. deleteResource right away.
export const apiInitializedFields = {
  api: {
    annotations: { data: [] },
    annotationUpvotes: { data: [] },
  },
};

export default combineReducers<IStore>({
  api,
  widgets,
  textSelector,
});
