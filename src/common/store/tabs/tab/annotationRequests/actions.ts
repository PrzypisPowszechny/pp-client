import { AnnotationRequestsStage } from './types';

import { ILocationData } from '../annotations/actions';

export const LOCATE_ANNOTATION_REQUESTS = 'LOCATE_ANNOTATION_REQUESTS';
export const LOCATE_CREATED_ANNOTATION_REQUESTS = 'LOCATE_CREATED_ANNOTATION_REQUESTS';
export const SET_ANNOTATION_REQUEST_STAGE = 'SET_ANNOTATION_REQUEST_STAGE';

export function locateAnnotationRequests({ located, unlocated }: ILocationData) {
  return {
    type: LOCATE_ANNOTATION_REQUESTS,
    payload: {
      located,
      unlocated,
    },
  };
}

export function locateCreatedAnnotationRequests({ located, unlocated }: ILocationData) {
  return {
    type: LOCATE_CREATED_ANNOTATION_REQUESTS,
    payload: {
      located,
      unlocated,
    },
  };
}

export function setAnnotationRequestStage(stage: AnnotationRequestsStage) {
  return {
    type: SET_ANNOTATION_REQUEST_STAGE,
    payload: {
      stage,
    },
  };
}
