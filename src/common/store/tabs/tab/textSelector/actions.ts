import { Range as XPathRange } from 'xpath-range';
import { AnnotationLocation } from 'content-scripts/handlers/annotation-event-handlers';

export const TEXT_SELECTED = 'TEXT_SELECTED';

export function makeSelection(annotationLocation?: AnnotationLocation) {
  return {
    type: TEXT_SELECTED,
    payload: annotationLocation ? {
      ...annotationLocation,
    } : {
      range: null,
      quote: '',
      quoteContext: '',
    },
  };
}
