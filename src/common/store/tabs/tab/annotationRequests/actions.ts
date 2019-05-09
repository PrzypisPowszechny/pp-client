import { ILocationData } from '../annotations/actions';

export const LOCATE_ANNOTATION_REQUESTS = 'LOCATE_ANNOTATION_REQUESTS';
export const LOCATE_CREATED_ANNOTATION_REQUESTS = 'LOCATE_CREATED_ANNOTATION_REQUESTS';

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
