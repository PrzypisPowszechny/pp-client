import { API_DELETED, API_READ } from 'redux-json-api/lib/constants';

import * as resourceTypes from 'common/api/resource-types';
import { getActionResourceType } from 'common/api/utils';

import {
  LOCATE_ANNOTATION_REQUESTS,
  LOCATE_CREATED_ANNOTATION_REQUESTS,
  SET_ANNOTATION_REQUEST_STAGE,
} from './actions';
import { AnnotationRequestsStage, AnnotationRequestsState } from './types';

const initialState: AnnotationRequestsState = {
  stage: AnnotationRequestsStage.unloaded,
  located: [],
  unlocated: [],
};

export default function annotations(state = initialState, action): AnnotationRequestsState {
  switch (action.type) {
    case SET_ANNOTATION_REQUEST_STAGE:
      return {
        ...state,
        stage: action.payload.stage,
      };
    case LOCATE_ANNOTATION_REQUESTS:
      return {
        ...state,
        ...action.payload,
        hasLoaded: true,
      };
    case LOCATE_CREATED_ANNOTATION_REQUESTS:
      return {
        ...state,
        located: [...state.located, ...action.payload.located],
        unlocated: [...state.unlocated, ...action.payload.unlocated],
      };
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
