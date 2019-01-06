import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import store from 'content-scripts/store';
import { mousePosition } from '../utils/mousePosition';
import _isEqual from 'lodash/isEqual';
import { selectAnnotation, selectAnnotations } from '../store/api/selectors';
import { locateAnnotations } from '../store/annotations/actions';
import { LocatedAnnotation } from '../store/annotations/types';
import { AnnotationAPIModel } from '../../common/api/annotations';
import { Range as XPathRange } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';
import { annotationRootNode } from '../settings';
import { setExtensionBadge } from '../../common/messages';
import * as chromeKeys from 'common/chrome-storage/keys';
import * as Sentry from '@sentry/browser';

import { selectAnnotationLocationForBrowserStorage } from '../store/annotations/selectors';

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
    const unlocatedAnnotations: AnnotationAPIModel[] = [];
    for (const annotation of annotations) {
      const { quote, range } = annotation.attributes;
      let locatedRange;
      if (range) {
        locatedRange = range;
      } else {
        locatedRange = findUniqueTextInDOMAsRange(quote, annotation.id);
      }
      if (locatedRange) {
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

    const locatedNumber = annotationLocations.length;
    setExtensionBadge(locatedNumber > 0 ? locatedNumber.toString() : '');

    // save for later, to check if updates are needed
    // Do it before dispatching, or we'll get into inifite dispatch loop!
    instance.annotationIds = annotationIds;
    instance.hasLoaded = hasLoaded;

    // Update the data
    store.dispatch(locateAnnotations(annotationLocations, unlocatedAnnotations.map(annotation => annotation.id)));
    // Save in store for popup reads
    chrome.storage.local.set({
        [chromeKeys.ANNOTATION_LOCATION]: selectAnnotationLocationForBrowserStorage(store.getState()),
    });
  }

}

function findUniqueTextInDOMAsRange(quote: string, debugId?: string): XPathRange.SerializedRange {
  const searchScopeRange = rangy.createRange();
  searchScopeRange.selectNodeContents(document.body);
  const options = {
    wholeWordsOnly: false,
    withinRange: searchScopeRange,
    direction: 'forward',
  };
  const range = rangy.createRange();
  // 1. Escape the characters (e.g. '.', '(', ')') having special meaning in regex
  // 2. Make the match more robust by:
  // - Allowing for multiple whitespaces (\s) and &nbsp;
  // &nbsp; appears naturally in HTML articles and is copy-pasted as a normal space;
  // As a result, we must take into account that each space may have been generated from a &nbsp;

  const searchRegexp = escapeRegExp(quote.trim()).replace(/\s/g, '(\\s|&nbsp;)+');
  if (PPSettings.DEV) {
    const annotationId = debugId ? debugId : 'no details';
    console.debug(`Locating annotation (${annotationId}) by regex: ${searchRegexp}`);
  }
  // We do not use the rangy explicit option "caseSensitive" -- setting "i" flag in Regex seems to work better
  if (range.findText(new RegExp(searchRegexp, 'i'), options)) {
    // Assume there is only one text like this on the page and return the first one
    return new XPathRange.BrowserRange(range).normalize().limit(annotationRootNode()).serialize(annotationRootNode());
  } else {
    return null;
  }
}
