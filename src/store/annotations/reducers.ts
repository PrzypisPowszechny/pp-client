import { LOCATE_ANNOTATIONS } from './actions';
import { AnnotationsState, LocatedAnnotation } from './types';

const initialState: AnnotationsState = {
  located: [],
  unlocated: [],
};

export default function annotations(state = initialState, action): AnnotationsState {
  switch (action.type) {
    case LOCATE_ANNOTATIONS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
