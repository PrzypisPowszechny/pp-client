import store from 'store';
import { mousePosition } from 'common/dom';
import _isEqual from 'lodash/isEqual';
import { selectAnnotations } from '../store/api/selectors';
import { findUniqueTextInDOMAsRange } from '../utils/annotations';
import { locateAnnotations } from '../store/annotations/actions';
import { LocatedAnnotation } from '../store/annotations/types';
import { AnnotationAPIModel } from '../api/annotations';

let instance;

function init() {
  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(processAnnotations);

  // store objects required for later operations
  instance = {
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
}

function processAnnotations() {
  const annotations: AnnotationAPIModel[] = selectAnnotations(store.getState());
  const annotationIds: string[] = annotations.map(annotation => annotation.id);

  // if annotation items have changed, locate them within the DOM
  if (!_isEqual(annotationIds, instance.annotationIds)) {
    const locatedAnnotations: LocatedAnnotation[] = [];
    const unlocatedAnnotations: string[] = [];
    for (const annotation of annotations) {
      const { quote, range } = annotation.attributes;
      let locatedRange;
      if (range) {
        locatedRange = range;
      } else {
        locatedRange = findUniqueTextInDOMAsRange(quote);
      }
      if (locatedRange) {
        locatedAnnotations.push({
          annotationId: annotation.id,
          range: locatedRange,
        });
      } else {
        unlocatedAnnotations.push(annotation.id);
      }
    }
    // save for later, to check if updates are needed
    // Do i before dispatching, or we'll into inifite dispatch loop!
    instance.annotationIds = annotationIds;
    store.dispatch(locateAnnotations(locatedAnnotations, unlocatedAnnotations));
  }

}

export default {
  init,
  deinit,
};
