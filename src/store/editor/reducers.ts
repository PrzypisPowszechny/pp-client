import {
  EDITOR_VISIBLE_CHANGE,
  IEditorVisibleChangeAction,
} from './actions';

export interface IEditorState {
  visible: boolean;
  location: {x: number; y: number};
  inverted: {x: boolean; y: boolean};
}

const initialState = {
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

function isInverted(x: number, y: number) {
  return [false, false];
}

export default function editor(state = initialState, action: IEditorVisibleChangeAction) {
  switch (action.type) {
    case EDITOR_VISIBLE_CHANGE:
      const location = action.payload.location || state.location;
      const inverted = isInverted(location.x, location.y);
      return Object.assign({}, state, {
          visible: action.payload.visible,
          location: {
            x: location.x,
            y: location.y,
          },
          inverted: {
            x: inverted[0],
            y: inverted[1],
          },
      });
    default:
      return state;
  }
}
