import {
  EDITOR_NEW_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
  MENU_WIDGET_CHANGE,
  VIEWER_VISIBLE_CHANGE,
} from './actions';

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

// todo here: update the location only when the annotations have also changed
// (to prevent the window from changing the location once displayed for a
function viewerActionHandler(state, payload) {
  return {
    ...state,
    viewer: {
      ...state.viewer,
      ...payload,
    },
  };
}
