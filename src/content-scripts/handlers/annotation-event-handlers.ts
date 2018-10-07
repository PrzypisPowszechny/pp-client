import { Range as XPathRange } from 'xpath-range';

import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import rangy from 'rangy';

import { mousePosition } from '../utils/mousePosition';
import store from 'content-scripts/store';
import { makeSelection, showMenu } from 'content-scripts/store/actions';

import { TextSelector } from '../utils/index';
import { hideMenu } from 'content-scripts/store/widgets/actions';
import { outsideArticleClasses, PPHighlightClass } from 'content-scripts/class-consts';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import { setSelectionRange, showEditorAnnotation } from '../store/widgets/actions';
import ppGA from 'common/pp-ga';
import { annotationRootNode } from '../main';

let handlers;

export default {
  init,
  deinit,
};

function init() {
  const selector = new TextSelector(annotationRootNode(), {
    onSelectionChange: selectionChangeCallback,
    outsideArticleClasses,
  });

  handlers = {
    selector,
  };

  chrome.runtime.onMessage.addListener(contextMenuAnnotateCallback);
}

export function deinit() {
  chrome.runtime.onMessage.removeListener(contextMenuAnnotateCallback);
  // (todo) deinitialize TextSelector
}

export function XPathNormalizedRangeToRangyRange(xPathRange: XPathRange.NormalizedRange) {
  const rangyRange = rangy.createRange();
  const textNodes = xPathRange.textNodes();
  rangyRange.setStartBefore(textNodes[0]);
  rangyRange.setEndAfter(textNodes[textNodes.length - 1]);
  return rangyRange;
}

export interface AnnotationLocation {
  range: XPathRange.SerializedRange;
  quote: string;
  quoteContext: string;
}

export function fullAnnotationLocation(normalizedRange: XPathRange.NormalizedRange): AnnotationLocation {
  const contextWidth = 100;
  // rangy.getSelection().setSingleRange(x);
  const rangyRange = XPathNormalizedRangeToRangyRange(normalizedRange);
  const quote = rangyRange.text();
  rangyRange.moveStart('character', -contextWidth);
  rangyRange.moveEnd('character', contextWidth);
  const quoteContext = rangyRange.text();
  return {
    range: normalizedRange.serialize(annotationRootNode(), `.${PPHighlightClass}`),
    quote,
    quoteContext,
  };
}

function selectionChangeCallback(
  selectedRanges: XPathRange.NormalizedRange[],
  isInsideArticle: boolean,
  event) {

  const appModes = selectModeForCurrentPage(store.getState());
  // Show the "add annotation" menu if in the annotation mode
  if (appModes.isAnnotationMode) {
    if (selectedRanges.length === 0 || (selectedRanges.length === 1 && !isInsideArticle)) {
      // Propagate to the store only selections fully inside the article (e.g. not belonging to any of PP components)
      // When we need to react also to other, we can easily expand the textSelector reducer; for now it' too eager.
      store.dispatch(makeSelection(null));
      store.dispatch(hideMenu());
    } else if (selectedRanges.length === 1) {
      store.dispatch(makeSelection(fullAnnotationLocation(selectedRanges[0])));
      store.dispatch(showMenu(mousePosition(event)));
    } else {
      console.warn('PP: more than one selected range is not supported');
    }
  }
}

function contextMenuAnnotateCallback(request, sender) {
  if (request.action === 'ANNOTATE') {
    /*
     * For now, do not check for being inside article.
     * Reason: checking ContextMenu API selection for being insideArticle is possible, but uncomfortable,
     * as context menu actions are handled in the separate background script.
     */
    const selection = handlers.selector.captureDocumentSelection();
    if (selection.length === 1) {
      const annotationLocation = fullAnnotationLocation(selection[0]);
      store.dispatch(setSelectionRange(annotationLocation));
      const selectionCenter = handlers.selector.currentSingleSelectionCenter();
      store.dispatch(showEditorAnnotation(selectionCenter.x, selectionCenter.y));
      ppGA.annotationAddFormDisplayed('rightMouseContextMenu');
    } else if (selection.length > 1) {
      console.warn('PP: more than one selected range is not supported');
    }
  }
}
