import { API_DELETED } from 'redux-json-api/lib/constants';

import * as resourceTypes from 'common/api/resource-types';
import { getActionResourceType } from 'common/api/utils';

import { LOCATE_ANNOTATIONS, LOCATE_CREATED_ANNOTATIONS, SET_ANNOTATION_STAGE } from './actions';
import { AnnotationsStage, AnnotationsState } from './types';

const initialState: AnnotationsState = {
  stage: AnnotationsStage.unloaded,
  located: [],
  unlocated: [],
};

export default function annotations(state = initialState, action): AnnotationsState {
  switch (action.type) {
    case SET_ANNOTATION_STAGE:
      return {
        ...state,
        stage: action.payload.stage,
      };
    case LOCATE_ANNOTATIONS:
      return {
        ...state,
        ...action.payload,
        hasLoaded: true,
      };
    case LOCATE_CREATED_ANNOTATIONS:
      return {
        ...state,
        located: [...state.located, ...action.payload.located],
        unlocated: [...state.unlocated, ...action.payload.unlocated],
      };
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
