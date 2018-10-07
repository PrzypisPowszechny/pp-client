import {
  EDITOR_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
  MENU_WIDGET_CHANGE,
  SET_EDITOR_SELECTION_RANGE, VIEWER_MODAL_CHANGE, VIEWER_REPORT_EDITOR_CHANGE,
  VIEWER_VISIBLE_CHANGE,
} from './actions';
import _difference from 'lodash/difference';
import { API_DELETED } from 'redux-json-api/lib/constants';
import { AnnotationResourceType } from 'content-scripts/api/annotations';
import { combineReducers } from 'redux';
import { MODIFY_APP_MODES } from '../appModes/actions';
import { isAnnotationMode } from 'content-scripts/store/appModes/selectors';
import { AnnotationLocation } from '../../handlers/annotationEventHandlers';

export interface IWidgetState {
  visible: boolean;
  location: { x: number; y: number };
}

export interface IViewerState extends IWidgetState {
  viewerItems: IViewerItemState[];
  deleteModal: any;
  mouseOver: boolean;
}

export interface IViewerItemState {
  annotationId: string;
  isReportEditorOpen: boolean;
}

// IEditorRange differs from Range.SerializedRange in that it is a simple object (not a class)
export interface IEditorRange {
  start: string;
  startOffset: number;
  end: string;
  endOffset: number;
}

export interface IEditorState extends IWidgetState {
  annotationId: string;
  annotationLocation: AnnotationLocation;
}

export interface WidgetReducer {
  editor: IEditorState;
  menu: IWidgetState;
  viewer: IViewerState;
}

const initialWidgetState = {
  visible: false,
  location: {
    x: 0,
    y: 0,
  },
};

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

function menu(state = initialWidgetState, action) {
  switch (action.type) {
    case MENU_WIDGET_CHANGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function editor(state = { annotationId: null, range: null, ...initialWidgetState }, action) {
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

const widgets = combineReducers({
  menu, viewer, editor,
});

export default widgets;
