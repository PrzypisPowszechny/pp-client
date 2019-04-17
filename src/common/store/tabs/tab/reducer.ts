import { combineReducers } from 'redux';
import { AnnotationsState } from './annotations/types';
import { AnnotationUpvoteAPIModel } from '../../../api/annotation-upvotes';
import { AppModes } from './appModes/types';
import { AnnotationAPIModel } from '../../../api/annotations';
import { WidgetReducer } from './widgets';
import { ITabInfoState, tabInfo } from './tabInfo';
import appModes from './appModes/reducers';
import annotations from './annotations/reducers';
import widgets from './widgets/reducers';
import textSelector from './textSelector/reducers';
import api from './api';

export interface ITabState {
  tabInfo: ITabInfoState;
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
  api,
  annotations,
  appModes,
  widgets,
  textSelector,
});
