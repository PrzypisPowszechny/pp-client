import { Range } from 'xpath-range';
import { AnnotationLocation } from '../../utils/annotations';

export const TEXT_SELECTED = 'TEXT_SELECTED';

export function makeSelection(annotationLocation?: AnnotationLocation) {
  return {
    type: TEXT_SELECTED,
    payload: annotationLocation ? {
      range: annotationLocation.range,
      text: annotationLocation.text,
    } : {
      range: null,
      text: '',
    },
  };
}
