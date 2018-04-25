import {
  EDITOR_NEW_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
  MENU_WIDGET_CHANGE,
  VIEWER_VISIBLE_CHANGE,
} from './actions';
import * as _ from "lodash";

export interface IWidgetState {
  visible: boolean;
  location: {x: number; y: number};
}

export interface IViewerState extends IWidgetState {
  annotationIds: any[];
}

export interface WidgetReducer {
  editor: IWidgetState;
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
    case EDITOR_NEW_ANNOTATION:
      return editorActionHandler(state, action.payload);
    case MENU_WIDGET_CHANGE:
      return menuActionHandler(state, action.payload);
    case VIEWER_VISIBLE_CHANGE:
      return viewerActionHandler(state, action.payload);
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
  // This prevents window from changing every time the user cursor slips off the widget
  const prevIds = state.viewer.annotationIds;
  const newIds = payload.annotationIds;
  let locationOverride = {};
  if (_.difference(prevIds, newIds).length === 0 && _.difference(newIds, prevIds).length === 0) {
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
