import { LocatedAnnotation } from './types';

export const LOCATE_ANNOTATIONS = 'LOCATE_ANNOTATIONS';

export function locateAnnotations(locatedAnnotations: LocatedAnnotation[], unlocatedAnnotations: string[]) {
  return {
    type: LOCATE_ANNOTATIONS,
    payload: {
      located: locatedAnnotations,
      unlocated: unlocatedAnnotations,
    },
  };
}
