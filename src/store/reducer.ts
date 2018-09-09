import { combineReducers } from 'redux';
import { reducer as api } from 'redux-json-api';
import widgets, { WidgetReducer } from './widgets/reducers';
import { AppModes } from './appModes/types';
import appModes from './appModes/reducers';
import textSelector from './textSelector/reducers';
import { AnnotationAPIModel, AnnotationViewModel } from 'api/annotations';
import { AnnotationUpvoteAPIModel } from 'api/annotation-upvotes';
import demagogApi from './demagogApi/reducers';

export interface ITabState {
  api: {
    annotations: { data: AnnotationAPIModel[] };
    annotationUpvotes: { data: AnnotationUpvoteAPIModel[] };
  };
  demagogApi: {
    annotations: AnnotationViewModel[];
  };
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
  demagogApi,
  appModes,
  widgets,
  textSelector,
});
