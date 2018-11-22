import { LOCATE_ANNOTATIONS } from './actions';
import { AnnotationsState, LocatedAnnotation } from './types';
import { API_READ } from 'redux-json-api/lib/constants';
import * as endpoints from '../../api/endpoints';

const initialState: AnnotationsState = {
  hasLoaded: false,
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
    case API_READ:
      // save it in state when the annotation endpoint has been read
      const { endpoint } = action.payload;
      if (endpoint === endpoints.ANNOTATIONS) {
        return {
          ...state,
          hasLoaded: true,
        };
      }
      break;
    default:
      return state;
  }
}
