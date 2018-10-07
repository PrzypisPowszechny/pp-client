import { Range as XPathRange } from 'xpath-range';

import { mousePosition } from '../utils/dom';
import store from 'content-scripts/store';
import { makeSelection, showMenu } from 'content-scripts/store/actions';

import { annotationRootNode, TextSelector } from '../core/index';
import { hideMenu } from 'content-scripts/store/widgets/actions';
import { outsideArticleClasses } from 'content-scripts/class_consts';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import { setSelectionRange, showEditorAnnotation } from '../store/widgets/actions';
import ppGA from 'common/pp-ga';
import { fullAnnotationLocation } from '../utils/annotations';

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
