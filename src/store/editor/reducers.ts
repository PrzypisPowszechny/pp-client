import {
  EDITOR_NEW_ANNOTATION,
  EDITOR_VISIBLE_CHANGE,
} from './actions';
import AnnotationViewModel from "../../models/AnnotationViewModel";

export interface IEditorState {
  visible: boolean;
  location: {x: number; y: number};
  annotation: AnnotationViewModel;
}

const initialState = {
  visible: false,
  location: {
    x: 0,
    y: 0,
  },
  annotationId: null,
};

export default function editor(state = initialState, action) {
  switch (action.type) {
    case EDITOR_VISIBLE_CHANGE:
      const location = action.payload.location || state.location;
      return Object.assign({}, state, {
          visible: action.payload.visible,
          location: {
            x: location.x,
            y: location.y,
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
