import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import { LocatedAnnotation } from '../../common/store/tabs/tab/annotations/types';
import { annotationRootNode } from '../settings';
import { Range as XPathRange } from 'xpath-range';
import { escapeRegExp } from 'tslint/lib/utils';
import { AnnotationAPIModel } from '../../common/api/annotations';
import * as Sentry from '@sentry/browser';
import { Store } from 'redux';
import { IState } from '../../common/store/reducer';

export class AnnotationLocator {

  static sendSentryLocationEvent(located: boolean, annotation: AnnotationAPIModel) {
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

  private document;
  private store;

  constructor(
    document: Document,
    store: Store<IState>,
  ) {
    this.document = document;
    this.store = store;
  }

  init() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  handleMessage = (request, sender, sendResponse) => {
    if (request.action === 'TAB_LOCATE_ANNOTATIONS') {
      sendResponse(this.locate(request.payload));
    }
  }

  locate(annotations: AnnotationAPIModel[]) {
    const located: LocatedAnnotation[] = [];
    const unlocated: LocatedAnnotation[] = [];
    for (const annotation of annotations) {
      const { quote, range } = annotation.attributes;
      let locatedRange;
      if (range) {
        locatedRange = range;
      } else {
        locatedRange = this.findUniqueTextInDOMAsRange(quote, annotation.id);
      }
      if (locatedRange) {
        located.push({
          annotationId: annotation.id,
          range: locatedRange,
        });
      } else {
        unlocated.push({
          annotationId: annotation.id,
          range: null,
        });
        if (!PPSettings.DEV_SENTRY_UNLOCATED_IGNORE) {
          AnnotationLocator.sendSentryLocationEvent(false, annotation);
        }
      }
    }
    return {
      located,
      unlocated,
    };
  }

  findUniqueTextInDOMAsRange(quote: string, debugId?: string): XPathRange.SerializedRange {
    const searchScopeRange = rangy.createRange();
    searchScopeRange.selectNodeContents(this.document.body);
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
}
