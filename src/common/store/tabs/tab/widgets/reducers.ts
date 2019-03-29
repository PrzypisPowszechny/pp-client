import {
  ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE,
  EDITOR_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
  MENU_WIDGET_CHANGE, NOTIFICATION_CHANGE,
  SET_EDITOR_SELECTION_RANGE, VIEWER_MODAL_CHANGE, VIEWER_REPORT_EDITOR_CHANGE,
  VIEWER_VISIBLE_CHANGE,
} from './actions';
import { API_DELETED } from 'redux-json-api/lib/constants';
import { AnnotationResourceType } from 'common/api/annotations';
import { combineReducers } from 'redux';
import { MODIFY_APP_MODES } from '../appModes/actions';
import { isAnnotationMode } from 'common/store/tabs/tab/appModes/selectors';
import { AnnotationLocation } from 'content-scripts/handlers/annotation-event-handlers';
import { AnnotationRequestFormData } from 'content-scripts/components/AnnotationRequestForm';

export interface IWidgetState {
  visible: boolean;
}

export interface IEditorState extends IWidgetState {
  annotationId: string;
  annotationLocation: AnnotationLocation;
  location: { x: number; y: number };
}

export interface IAnnotationRequestFormState extends IWidgetState {
  initialData: Partial<AnnotationRequestFormData>;
}

export interface IViewerState extends IWidgetState {
  location: { x: number; y: number };
  viewerItems: IViewerItemState[];
  deleteModal: any;
  mouseOver: boolean;

}

export interface IViewerItemState {
  annotationId: string;
  isReportEditorOpen: boolean;
}

export interface INotificationState {
  message?: string;
  visible: boolean;
}

export interface WidgetReducer {
  editor: IEditorState;
  menu: IWidgetState;
  annotationRequestForm: IAnnotationRequestFormState;
  viewer: IViewerState;
  notification: INotificationState;
}

const initialWidgetState = {
  visible: false,
};

const initialEditorState = {
  ...initialWidgetState,
  annotationId: null,
  range: null,
};

function editor(state = initialEditorState, action) {
  switch (action.type) {
    case EDITOR_VISIBLE_CHANGE:
    case EDITOR_ANNOTATION:
    case SET_EDITOR_SELECTION_RANGE:
      return { ...state, ...action.payload };
    case MODIFY_APP_MODES:
      // When the annotation mode is turned off, editor is closed
      return {
        ...state,
        visible: state.visible && isAnnotationMode(action.payload),
      };
    default:
      return state;
  }

}

function menu(state = initialWidgetState, action) {
  switch (action.type) {
    case MENU_WIDGET_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function annotationRequestForm(state = initialWidgetState, action) {
  switch (action.type) {
    case ANNOTATION_REQUEST_FORM_VISIBLE_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }

}
const initialViewerState = {
  ...initialWidgetState,
  deleteModal: {},
  viewerItems: [],
};

function viewer(state = initialViewerState, action) {
  switch (action.type) {
    case VIEWER_VISIBLE_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case VIEWER_MODAL_CHANGE:
      return {
        ...state,
        deleteModal: action.payload,
      };
    case VIEWER_REPORT_EDITOR_CHANGE:
      return {
        ...state,
        viewerItems: state.viewerItems.map(item =>
          item.annotationId === action.payload.annotationId ?
            // Update fields related to this action, preserving all other
            { ...item, ...action.payload } :
            // If no change to item, do not re-create it, map will trigger necessary updated anyway
            item,
        ),
      };
    case API_DELETED:
      // If one of viewed annotation is removed, filter it out
      const { type: resType, id: resId } = action.payload;
      if (resType === AnnotationResourceType && state.visible) {
        const filteredViewerItems = state.viewerItems.slice()
          .filter(item => item.annotationId !== resId);

        if (state.viewerItems.length !== filteredViewerItems.length) {
          return {
            ...state,
            viewerItems: filteredViewerItems,
            visible: filteredViewerItems.length > 0,
          };
        }
      }
      return state;
    default:
      return state;
  }
}

function notification(state = { visible: false }, action) {
  switch (action.type) {
    case NOTIFICATION_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const widgets = combineReducers({
  editor, menu, annotationRequestForm, viewer, notification,
});

export default widgets;
