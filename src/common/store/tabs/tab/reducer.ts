import { combineReducers } from 'redux';
import { AnnotationsState } from '../../../../content-scripts/store/annotations/types';
import { AnnotationUpvoteAPIModel } from '../../../api/annotation-upvotes';
import { AppModes } from '../../../../content-scripts/store/appModes/types';
import { AnnotationAPIModel } from '../../../api/annotations';
import { WidgetReducer } from '../../../../content-scripts/store/widgets';
import { tabInfo } from './tabInfo';
import appModes from '../../../../content-scripts/store/appModes/reducers';
import annotations from '../../../../content-scripts/store/annotations/reducers';
import widgets from '../../../../content-scripts/store/widgets/reducers';
import textSelector from '../../../../content-scripts/store/textSelector/reducers';
import { initializedApi } from './api';

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

export default combineReducers<ITabState>({
  tabInfo,
  api: initializedApi,
  annotations,
  appModes,
  widgets,
  textSelector,
});
