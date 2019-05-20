import { combineReducers } from 'redux';

import annotationRequests from './annotationRequests/reducers';
import { AnnotationRequestsState } from './annotationRequests/types';
import annotations from './annotations/reducers';
import { AnnotationsState } from './annotations/types';
import api from './api';
import appModes from './appModes/reducers';
import { AppModes } from './appModes/types';
import { IPopupInfoState } from './popupInfo';
import popupInfo from './popupInfo/reducers';
import { ITabInfoState, tabInfo } from './tabInfo';
import textSelector from './textSelector/reducers';
import { WidgetReducer } from './widgets';
import widgets from './widgets/reducers';

import { AnnotationUpvoteAPIModel } from '../../../api/annotation-upvotes';
import { AnnotationAPIModel } from '../../../api/annotations';

export interface ITabState {
  tabInfo: ITabInfoState;
  popupInfo: IPopupInfoState;
  api: {
    annotations: { data: AnnotationAPIModel[] };
    annotationUpvotes: { data: AnnotationUpvoteAPIModel[] };
  };
  annotations: AnnotationsState;
  annotationRequests: AnnotationRequestsState;
  appModes: AppModes;
  widgets: WidgetReducer;
  textSelector: any;
}

export default combineReducers<ITabState>({
  tabInfo,
  popupInfo,
  api,
  annotations,
  annotationRequests,
  appModes,
  widgets,
  textSelector,
});
