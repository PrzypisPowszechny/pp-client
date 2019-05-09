
// import more rangy modules if needed
import 'rangy/lib/rangy-textrange';
import rangy from 'rangy';

import { LocatedAnnotation } from 'common/store/tabs/tab/annotations/types';
import { annotationRootNode } from '../settings';
import { Range as XPathRange } from 'xpath-range';
import { AnnotationAPIModel } from 'common/api/annotations';
import * as Sentry from '@sentry/browser';
import { Store } from 'redux';
import { IState } from 'common/store/reducer';
import { waitUntilPageLoaded } from 'common/utils/init';
import _escapeRegExp from 'lodash/escapeRegExp';
import { AnnotationRequestAPIModel } from 'common/api/annotation-requests';
import * as resourceTypes from 'common/api/resource-types';

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
  private documentReady: boolean;

  constructor(
    document: Document,
    store: Store<IState>,
  ) {
    this.document = document;
    this.store = store;
    this.documentReady = false;
  }

  init() {
    chrome.runtime.onMessage.addListener(this.handleMessage);

  }

  handleMessage = (request, sender, sendResponse) => {
    if (request.action === 'TAB_LOCATE_ANNOTATIONS') {
      waitUntilPageLoaded(this.document)
        .then(() => {
          this.locate(request.payload).then(sendResponse);
        }).catch((err) => {
        throw new Error(`Error locating annotations: ${err.toString()}`);
      });
      return true;
    }
  }

  async locate(annotations: AnnotationAPIModel[] | AnnotationRequestAPIModel[]) {
    const located: LocatedAnnotation[] = [];
    const unlocated: LocatedAnnotation[] = [];
    for (const annotation of annotations) {
      const { quote } = annotation.attributes;
      const locatedRange = await this.findUniqueTextInDOMAsRange(quote, annotation.id);
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
        if (!PPSettings.DEV_SENTRY_UNLOCATED_IGNORE && annotation.type === resourceTypes.ANNOTATIONS) {
          AnnotationLocator.sendSentryLocationEvent(false, annotation as AnnotationAPIModel);
        }
      }
    }
    return {
      located,
      unlocated,
    };
  }

  waitUntilRangyReady() {
    let intervalId;
    return new Promise((resolve) => {
      const rangyCheck = () => {
        try {
          rangy.createRange();
        } catch (e) {
          return;
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
        resolve();
      };
      rangyCheck();
      intervalId = setInterval(rangyCheck, 50);
    });
  }

  async findUniqueTextInDOMAsRange(quote: string, debugId?: string): Promise<XPathRange.SerializedRange> {
    // rangy can be unpredictable and throw errors when run right after DOM is loaded
    await this.waitUntilRangyReady();
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

    const searchRegexp = _escapeRegExp(quote.trim()).replace(/\s/g, '(\\s|&nbsp;)+');
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
