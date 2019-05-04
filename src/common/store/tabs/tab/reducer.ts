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
import popupInfo from './popupInfo/reducers';
import { IPopupInfoState } from './popupInfo';

export interface ITabState {
  tabInfo: ITabInfoState;
  popupInfo: IPopupInfoState;
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
  popupInfo,
  api,
  annotations,
  appModes,
  widgets,
  textSelector,
});
