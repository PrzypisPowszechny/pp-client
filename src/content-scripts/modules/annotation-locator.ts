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
import { annotationRootNode } from '../settings';
import * as Sentry from '@sentry/browser';
import * as DOMNotifications from '../dom-notifications';

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

function sendLocationEvent(located: boolean, annotation: AnnotationAPIModel) {
  Sentry.withScope((scope) => {
    scope.setExtra('details', `quote=${annotation.attributes.quote}`);
    if (located) {
      Sentry.captureEvent({
        message: `annotation_located:${window.location.href}`,
      });
    } else {
      Sentry.captureEvent({
        message: `annotation_unlocated:${window.location.href}`,
      });
    }
  });
}

function annotationLocator() {
  const annotations: AnnotationAPIModel[] = selectAnnotations(store.getState());
  const annotationIds: string[] = annotations.map(annotation => annotation.id);
  const hasLoaded: boolean = store.getState().annotations.hasLoaded;
  // if annotation items have changed, locate them within the DOM
  if (!_isEqual(annotationIds, instance.annotationIds) || hasLoaded !== instance.hasLoaded) {
    const annotationLocations: LocatedAnnotation[] = [];
    const locatedAnnotations: AnnotationAPIModel[] = [];
    const unlocatedAnnotations: AnnotationAPIModel[] = [];
    for (const annotation of annotations) {
      const { quote, range } = annotation.attributes;
      let locatedRange;
      if (range) {
        locatedRange = range;
      } else {
        locatedRange = findUniqueTextInDOMAsRange(quote);
      }
      if (locatedRange) {
        locatedAnnotations.push(annotation);
        annotationLocations.push({
          annotationId: annotation.id,
          range: locatedRange,
        });
      } else {
        unlocatedAnnotations.push(annotation);
        if (!PPSettings.DEV_SENTRY_UNLOCATED_IGNORE) {
          sendLocationEvent(false, annotation);
        }
      }
    }

    if (unlocatedAnnotations.length > 0) {
      console.warn(`${unlocatedAnnotations.length} annotations have not been located`);
    }
    console.info(`${locatedAnnotations.length} annotations have been located`);

    if (store.getState().annotations.hasLoaded) {
      // If the annotations (or lack thereof) have been returned from the server,
      // save the information to DOM for reads in selenium
      DOMNotifications.setAnnotationLocationInfo({ located: locatedAnnotations, unlocated: unlocatedAnnotations });
    }

    // save for later, to check if updates are needed
    // Do it before dispatching, or we'll get into inifite dispatch loop!
    instance.annotationIds = annotationIds;
    instance.hasLoaded = hasLoaded;
    store.dispatch(locateAnnotations(annotationLocations, unlocatedAnnotations.map(annotation => annotation.id)));
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

  // const modifiedQuote = quote.trim();
  const modifiedQuote = quote.split('\n')[0].replace(/\s*\([^()]+przyp\.\sred\.\)\s*/gi, ' ').replace(/\s*\([….]+\)\s*/g, ' ').trim();
  console.log(modifiedQuote);
  // let searchRegexp = modifiedQuote.replace(/[.,-]/g, '$1?');
  const searchRegexp = escapeRegExp(modifiedQuote).replace(/\s/g, '\\s*').replace(/([-,–„”…]|\\\.)/g, '.');
  // const searchRegexp = modifiedQuote;
  console.log(searchRegexp);

  // Assume there is only one text like this on the page and return the first one
  if (range.findText(new RegExp(searchRegexp, 'i'), options)) {
    // if (range.findText(new RegExp(searchRegexp), options)) {
    return new XPathRange.BrowserRange(range).normalize().limit(annotationRootNode()).serialize(annotationRootNode());
  } else {
    return null;
  }
}
