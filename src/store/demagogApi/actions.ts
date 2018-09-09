import { AnnotationViewModel } from '../../api/annotations';

export const DEMAGOG_ANNOTATIONS_LOADED = 'DEMAGOG_ANNOTATIONS_LOADED';

export function setDemagogAnnotations(annotations: AnnotationViewModel[]) {
  return {
    type: DEMAGOG_ANNOTATIONS_LOADED,
    payload: {
      annotations,
    },
  };
}
