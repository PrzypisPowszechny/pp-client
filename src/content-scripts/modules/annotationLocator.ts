import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import store from 'content-scripts/store';
import { mousePosition } from '../utils/mousePosition';
import _isEqual from 'lodash/isEqual';
import { selectAnnotations } from '../store/api/selectors';
import { locateAnnotations } from '../store/annotations/actions';
import { LocatedAnnotation } from '../store/annotations/types';
import { AnnotationAPIModel } from '../api/annotations';
import { Range as XPathRange } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';
import { annotationRootNode } from '../main';

let instance;

export default {
  init,
  deinit,
};

function init() {
  // subscribe to store changes and return unsubscribe fn
  const unsubscribe = store.subscribe(annotationLocator);

  // store objects required for later operations
  instance = {
    unsubscribe,
  };
}

function deinit() {
  instance.unsubscribe();
}

function annotationLocator() {
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

function findUniqueTextInDOMAsRange(quote: string): XPathRange.SerializedRange {
  const searchScopeRange = rangy.createRange();
  searchScopeRange.selectNodeContents(document.body);
  const options = {
    caseSensitive: false,
    wholeWordsOnly: false,
    withinRange: searchScopeRange,
    direction: 'forward',
  };
  const range = rangy.createRange();
  // 1. Escape the characters (e.g. '.', '(', ')') having special meaning in regex
  // 2. Replace spaces with \s+ for more robustness
  // todo consider removing some other characters not essential to the sentence content
  const searchRegexp = escapeRegExp(quote.trim()).replace(/\s/, '\\s+');

  // Assume there is only one text like this on the page and return the first one
  if (range.findText(new RegExp(searchRegexp), options)) {
    return new XPathRange.BrowserRange(range).normalize().limit(annotationRootNode()).serialize(annotationRootNode());
  } else {
    return null;
  }
}
