import { Range as XPathRange } from 'xpath-range';

import { mousePosition } from 'common/dom';
import store from 'store';
import { makeSelection, showMenu } from 'store/actions';

import { annotationRootNode, Highlighter, TextSelector } from '../core/index';
import { hideMenu } from 'store/widgets/actions';
import { outsideArticleClasses } from 'class_consts';
import highlights from './highlights';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import { setSelectionRange, showEditorAnnotation } from '../store/widgets/actions';
import ppGA from 'pp-ga';
import { AnnotationLocation, fullAnnotationLocation } from '../utils/annotations';
import processAnnotations from './processAnnotations';

let handlers;

export function initializeDocumentHandlers() {
  const highlighter = new Highlighter(annotationRootNode());
  const selector = new TextSelector(annotationRootNode(), {
    onSelectionChange: selectionChangeCallback,
    outsideArticleClasses,
  });

  handlers = {
    highlighter,
    selector,
  };

  highlights.init(highlighter);
  processAnnotations.init();
  chrome.runtime.onMessage.addListener(contextMenuAnnotateCallback);
}

export function deinitializeCoreHandlers() {
  highlights.deinit();
  chrome.runtime.onMessage.removeListener(contextMenuAnnotateCallback);
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
