import { AnnotationsStage, LocatedAnnotation } from './types';

export const LOCATE_ANNOTATIONS = 'LOCATE_ANNOTATIONS';
export const LOCATE_CREATED_ANNOTATIONS = 'LOCATE_CREATED_ANNOTATIONS';
export const SET_ANNOTATION_STAGE = 'SET_ANNOTATION_STAGE';

export interface ILocationData {
  located: LocatedAnnotation[];
  unlocated: LocatedAnnotation[];
}

export function locateAnnotations({ located, unlocated }: ILocationData) {
  return {
    type: LOCATE_ANNOTATIONS,
    payload: {
      located,
      unlocated,
    },
  };
}

export function locateCreatedAnnotations({ located, unlocated }: ILocationData) {
  return {
    type: LOCATE_CREATED_ANNOTATIONS,
    payload: {
      located,
      unlocated,
    },
  };
}

export function setAnnotationStage(stage: AnnotationsStage) {
  return {
    type: SET_ANNOTATION_STAGE,
    payload: {
      stage,
    },
  };
}
