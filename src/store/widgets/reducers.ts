import {
  EDITOR_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
  MENU_WIDGET_CHANGE,
  SET_EDITOR_SELECTION_RANGE,
  VIEWER_VISIBLE_CHANGE,
} from './actions';
import _difference from 'lodash/difference';
import { API_DELETED } from 'redux-json-api/lib/constants';
import { AnnotationResourceType } from '../../api/annotations';
import { combineReducers } from 'redux';

export interface IWidgetState {
  visible: boolean;
  location: {x: number; y: number};
}

export interface IViewerState extends IWidgetState {
  annotationIds: string[];
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
  range: IEditorRange;
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

const widgets = combineReducers({
  menu, viewer, editor,
});
export default widgets;

function viewer(state = { ...initialWidgetState, annotationIds: [] } , action) {
  switch (action.type) {
    case VIEWER_VISIBLE_CHANGE:
      // Update location only when the displayed annotations have changed, too.
      // This prevents window from changing every time the user's cursor slips off the widget
      const prevIds = state.annotationIds;
      const newIds = action.payload.annotationIds;
      let locationOverride = {};
      if (_difference(prevIds, newIds).length === 0 && _difference(newIds, prevIds).length === 0) {
        locationOverride = {
          location: state.location,
        };
      }
      return {
        ...state,
        ...action.payload,
        ...locationOverride,
      };
    case API_DELETED:
      // If one of viewed annotation is removed, filter it out
      const { type: resType, id: resId } = action.payload;
      if (resType === AnnotationResourceType && state.visible) {
        const filteredAnnotationIds = state.annotationIds.slice()
          .filter(id => id !== resId);

        if (state.annotationIds.length !== filteredAnnotationIds.length) {
          return {
            ...state,
            annotationIds: filteredAnnotationIds,
            visible: filteredAnnotationIds.length > 0,
          };
        }
      }
      return state;
    default:
      return state;
  }
}

function menu(state = initialWidgetState , action) {
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
    default:
      return state;
  }
}
