import {
  EDITOR_NEW_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
} from './actions';
import AnnotationViewModel from "../../models/AnnotationViewModel";

export interface IEditorState {
  visible: boolean;
  location: {x: number; y: number};
  inverted: {x: boolean; y: boolean};
  annotation: AnnotationViewModel;
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
  annotationId: null,
};

function isInverted(x: number, y: number) {
  return [false, false];
}

export default function editor(state = initialState, action) {
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
    case EDITOR_NEW_ANNOTATION:
      return Object.assign({}, state, {
        visible: true,
        location: Object.assign({}, action.payload.location),
        annotationId: null,
      });
    default:
      return state;
  }
}
