import { LOCATE_ANNOTATIONS } from './actions';
import { AnnotationsState } from './types';
import { API_READ, API_CREATED, API_DELETED } from 'redux-json-api/lib/constants';
import * as endpoints from 'common/api/endpoints';

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
      if (action.payload.endpoint === endpoints.ANNOTATIONS) {
        return {
          ...state,
          hasLoaded: true,
        };
      } else {
        return state;
      }

    case API_CREATED:
      // save it in state when the annotation endpoint has been read
      if (action.payload.data.type === endpoints.ANNOTATIONS) {
        const { data } = action.payload;
        const located = [...state.located, { annotationId: data.id, range: data.attributes.range }];
        return {
          ...state,
          located,
        };
      } else {
        return state;
      }
    case API_DELETED:
      // save it in state when the annotation endpoint has been read
      if (action.payload.type === endpoints.ANNOTATIONS) {
        const { id } = action.payload;
        const located = state.located.filter(annotation => annotation.annotationId !== id);
        return {
          ...state,
          located,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
