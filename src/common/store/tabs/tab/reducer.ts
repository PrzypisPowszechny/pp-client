import { combineReducers } from 'redux';
import { AnnotationsState } from '../../../../content-scripts/store/annotations/types';
import { AnnotationUpvoteAPIModel } from '../../../api/annotation-upvotes';
import { AppModes } from '../../../../content-scripts/store/appModes/types';
import { AnnotationAPIModel } from '../../../api/annotations';
import { WidgetReducer } from '../../../../content-scripts/store/widgets';
import { tabInfo } from './tabInfo';
import { reducer as api } from 'redux-json-api';
import appModes from '../../../../content-scripts/store/appModes/reducers';
import annotations from '../../../../content-scripts/store/annotations/reducers';
import widgets from '../../../../content-scripts/store/widgets/reducers';
import textSelector from '../../../../content-scripts/store/textSelector/reducers';
import { TAB_INIT } from '../actions';

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

function initializedApi(state, action) {
  if (action.type === TAB_INIT) {
    return { ...apiInitializedFields };
  } else {
    return api(state, action);
  }
}

export default combineReducers<ITabState>({
  tabInfo,
  api: initializedApi,
  annotations,
  appModes,
  widgets,
  textSelector,
});
