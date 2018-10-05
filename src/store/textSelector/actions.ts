import { Range as XPathRange } from 'xpath-range';
import { AnnotationLocation } from '../../utils/annotations';

export const TEXT_SELECTED = 'TEXT_SELECTED';

export function makeSelection(annotationLocation?: AnnotationLocation) {
  return {
    type: TEXT_SELECTED,
    payload: annotationLocation ? {
      range: annotationLocation.range,
      quote: annotationLocation.quote,
    } : {
      range: null,
      quote: '',
    },
  };
}
