import { API_DELETED, API_READ } from 'redux-json-api/lib/constants';

import * as resourceTypes from 'common/api/resource-types';
import { getActionResourceType } from 'common/api/utils';

import { LOCATE_ANNOTATIONS, LOCATE_CREATED_ANNOTATIONS } from './actions';
import { AnnotationsState } from './types';

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
    case LOCATE_CREATED_ANNOTATIONS:
      return {
        ...state,
        located: [ ...state.located, ...action.payload.located ],
        unlocated: [ ...state.unlocated, ...action.payload.unlocated ],
      };
    case API_READ:
      // save it in state when the annotation endpoint has been read
      if (getActionResourceType(action) === resourceTypes.ANNOTATIONS) {
        return {
          ...state,
          hasLoaded: true,
        };
      } else {
        return state;
      }
    case API_DELETED:
      if (getActionResourceType(action) === resourceTypes.ANNOTATIONS) {
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
