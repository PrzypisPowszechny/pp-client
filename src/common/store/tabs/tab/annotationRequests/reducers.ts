import { LOCATE_ANNOTATION_REQUESTS, LOCATE_CREATED_ANNOTATION_REQUESTS } from './actions';
import { AnnotationsState } from '../annotations/types';
import { API_READ, API_CREATED, API_DELETED } from 'redux-json-api/lib/constants';
import * as resourceTypes from 'common/api/resource-types';
import { getActionResourceType } from 'common/api/utils';

const initialState: AnnotationsState = {
  hasLoaded: false,
  located: [],
  unlocated: [],
};

export default function annotations(state = initialState, action): AnnotationsState {
  switch (action.type) {
    case LOCATE_ANNOTATION_REQUESTS:
      return {
        ...state,
        ...action.payload,
      };
    case LOCATE_CREATED_ANNOTATION_REQUESTS:
      return {
        ...state,
        located: [ ...state.located, ...action.payload.located ],
        unlocated: [ ...state.unlocated, ...action.payload.unlocated ],
      };
    case API_READ:
      // save it in state when the annotation request endpoint has been read
      if (getActionResourceType(action) === resourceTypes.ANNOTATION_REQUESTS) {
        return {
          ...state,
          hasLoaded: true,
        };
      } else {
        return state;
      }
    case API_DELETED:
      if (getActionResourceType(action) === resourceTypes.ANNOTATION_REQUESTS) {
        const { id } = action.payload;
        const located = state.located.filter(annotation => annotation.annotationId !== id);
        const unlocated = state.unlocated.filter(annotation => annotation.annotationId !== id);
        return {
          ...state,
          located,
          unlocated,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
