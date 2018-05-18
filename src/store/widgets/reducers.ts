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

const initialState = {
  editor: {
    annotationId: null,
    range: null,
    ...initialWidgetState,
  },
  menu: {
    ...initialWidgetState,
  },
  viewer: {
    ...initialWidgetState,
    annotationIds: [],
  },
};

export default function widgets(state = initialState, action): WidgetReducer {
  switch (action.type) {
    case EDITOR_VISIBLE_CHANGE:
    case EDITOR_ANNOTATION:
    case SET_EDITOR_SELECTION_RANGE:
      return editorActionHandler(state, action.payload);
    case MENU_WIDGET_CHANGE:
      return menuActionHandler(state, action.payload);
    case VIEWER_VISIBLE_CHANGE:
      return viewerActionHandler(state, action.payload);
    case API_DELETED:
      return apiDeletedActionHandler(state, action.payload);
    default:
      return state;
  }
}

function editorActionHandler(state, payload) {
  return {
    ...state,
    editor: {
      ...state.editor,
      ...payload,
    },
  };
}

function menuActionHandler(state, payload) {
  return {
    ...state,
    menu: {
      ...state.menu,
      ...payload,
    },
  };
}

function viewerActionHandler(state, payload) {
  // Update location only when the displayed annotations have changed, too.
  // This prevents window from changing every time the user's cursor slips off the widget
  const prevIds = state.viewer.annotationIds;
  const newIds = payload.annotationIds;
  let locationOverride = {};
  if (_difference(prevIds, newIds).length === 0 && _difference(newIds, prevIds).length === 0) {
    locationOverride = {
      location: state.viewer.location,
    };
  }

  return {
    ...state,
    viewer: {
      ...state.viewer,
      ...payload,
      ...locationOverride,
    },
  };
}

function apiDeletedActionHandler(state, {type: resType, id: resId}) {
  if (resType === AnnotationResourceType && state.viewer.visible) {
    const filteredAnnotationIds = state.viewer.annotationIds.slice()
      .filter(id => id !== resId);

    if (state.viewer.annotationIds.length !== filteredAnnotationIds.length) {
      return {
        ...state,
        viewer: {
          ...state.viewer,
          annotationIds: filteredAnnotationIds,
          visible: filteredAnnotationIds.length > 0,
        }};
    }
  }
  return state;
}