import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import widgets, { WidgetReducer } from './widgets/reducers';
import { AppModes } from './appModes/types';
import appModes from './appModes/reducers';
import textSelector from './textSelector/reducers';
import { AnnotationAPIModel } from 'api/annotations';
import { AnnotationUpvoteAPIModel } from 'api/annotation-upvotes';
import { AnnotationsState } from './annotations/types';
import annotations from './annotations/reducers';

export interface ITabState {
  api: {
    annotations: { data: AnnotationAPIModel[] };
    annotationUpvotes: { data: AnnotationUpvoteAPIModel[] };
  };
  annotations: AnnotationsState;
  appModes: AppModes;
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

export default combineReducers<ITabState>({
  api,
  annotations,
  appModes,
  widgets,
  textSelector,
});
