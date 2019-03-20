import { LocatedAnnotation } from './types';

export const LOCATE_ANNOTATIONS = 'LOCATE_ANNOTATIONS';

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
