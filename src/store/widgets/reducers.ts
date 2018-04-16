import {
  EDITOR_VISIBLE_CHANGE,
  IEditorVisibleChangeAction, MENU_WIDGET_CHANGE,
} from './actions';

export interface IWidgetState {
  visible: boolean;
  location: {x: number; y: number};
  inverted: {x: boolean; y: boolean};
}

export interface WidgetReducer {
  editor: IWidgetState,
  menu: IWidgetState,
}

const initialWidgetState = {
  visible: false,
  location: {
    x: 0,
    y: 0,
  },
  inverted: {
    x: false,
    y: false,
  },
};

const initialState = {
  editor: {
    ...initialWidgetState,
  },
  menu: {
    ...initialWidgetState,
  },
};

function isInverted(x: number, y: number) {
  return [false, false];
}

export default function widgets(state = initialState, action: IEditorVisibleChangeAction): WidgetReducer {
  switch (action.type) {
    case EDITOR_VISIBLE_CHANGE:
      return editorActionHandler(state, action.payload);
    case MENU_WIDGET_CHANGE:
      return menuActionHandler(state, action.payload);
    default:
      return state;
  }
}

function editorActionHandler(state, payload) {
  // TODO add inverted handling?
  console.log(payload);
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
