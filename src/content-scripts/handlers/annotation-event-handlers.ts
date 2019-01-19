import { Range as XPathRange } from 'xpath-range';

import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import 'rangy/lib/rangy-textrange';
import 'rangy/lib/rangy-serializer';
import rangy from 'rangy';

import mousePosition from '../utils/mousePosition';
import { makeSelection, showMenu } from 'content-scripts/store/actions';

import { TextSelector } from '../utils/index';
import { hideMenu } from 'content-scripts/store/widgets/actions';
import {
  annotationRootNode,
  outsideArticleClasses,
  PPHighlightClass,
  quoteContextWidth,
} from 'content-scripts/settings';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
import { setSelectionRange, showEditorAnnotation } from '../store/widgets/actions';
import ppGa from 'common/pp-ga';
import { standardizeUrlForPageSettings } from '../../common/url';
import { turnOnRequestMode } from '../../common/chrome-storage';
import store from '../store';
import { selectAnnotationLocationForBrowserStorage } from '../store/annotations/selectors';
import { PopupAnnotationLocationData } from '../../popup/messages';

let handlers;

export default {
  init,
  displayAnnotationMenuForCurrentSelection,
  deinit,
};

export interface AnnotationLocation {
  range: XPathRange.SerializedRange;
  quote: string;
  quoteContext: string;
}

function init() {
  const selector = new TextSelector(annotationRootNode(), {
    onSelectionChange: selectionChangeCallback,
    outsideArticleClasses,
  });

  handlers = {
    selector,
  };

  chrome.runtime.onMessage.addListener(contextMenuCallback);
  chrome.runtime.onMessage.addListener(popupGetAnnotationMessageHandler);

  // This special hook for selenium e2e test to open editor as context menu click is out of selenium's control...
  document.addEventListener('EMULATE_ON_CONTEXT_MENU_ANNOTATE', annotateCommand);
  document.addEventListener('EMULATE_ON_CONTEXT_MENU_ANNOTATION_REQUEST', annotationRequestCommand);
}

export function deinit() {
  chrome.runtime.onMessage.removeListener(contextMenuCallback);
  chrome.runtime.onMessage.removeListener(popupGetAnnotationMessageHandler);
  // (todo) deinitialize TextSelector
}

function selectionChangeCallback(
  selectedRanges: XPathRange.NormalizedRange[],
  isInsideArticle: boolean,
  event) {

  const appModes = selectModeForCurrentPage(store.getState());
  // Show the "add annotation" menu if in the annotation mode
  if (appModes.isAnnotationMode) {
    if (selectedRanges && selectedRanges.length === 0 || (selectedRanges.length === 1 && !isInsideArticle)) {
      // Propagate to the store only selections fully inside the article (e.g. not belonging to any of PP components)
      // When we need to react also to other, we can easily expand the textSelector reducer; for now it' too eager.
      updateMenuForNoSelection();
    } else if (selectedRanges.length === 1) {
      updateMenuForSelection(selectedRanges[0], mousePosition(event));
    } else {
      console.warn('PP: more than one selected range is not supported');
    }
  }
}

function updateMenuForNoSelection() {
  store.dispatch(makeSelection(null));
  store.dispatch(hideMenu());
}

function updateMenuForSelection(selectedRange: XPathRange.NormalizedRange, position?) {
  // When position is null, use the center of selection to display the menu
  store.dispatch(makeSelection(fullAnnotationLocation(selectedRange)));
  if (!position) {
    position = handlers.selector.currentSingleSelectionCenter();
  }
  store.dispatch(showMenu(position));
}

function displayAnnotationMenuForCurrentSelection() {
  const selection = tryGetSingleSelection();
  /*
   * For now, do not check for being inside article.
   * Reason: huge refactor coming soon
   */
  if (selection) {
    updateMenuForSelection(selection);
  }
}

function popupGetAnnotationMessageHandler(request, sender, sendResponse) {
  if (request.action === 'GET_ANNOTATIONS') {
    console.debug(`Annotations requested from popup`);
    const response: PopupAnnotationLocationData = selectAnnotationLocationForBrowserStorage(store.getState());
    sendResponse(response);
  }
}

function contextMenuCallback(request, sender) {
  if (request.action === 'ANNOTATE') {
    annotateCommand();
  }
  if (request.action === 'ANNOTATION_REQUEST') {
    annotationRequestCommand();
  }
}

function tryGetSingleSelection() {
  const selection = handlers.selector.captureDocumentSelection();
  if (selection.length === 1) {
    return selection[0];
  } else if (selection.length > 1) {
    console.warn('PP: more than one selected range is not supported');
    return null;
  }
}

function annotationRequestCommand() {
  const selection = tryGetSingleSelection();
  if (selection) {
    const currentUrl = window.location.href;
    const annotationLocation = fullAnnotationLocation(selection);

    const formData = {
      url: window.location.href,
      quote: annotationLocation.quote,
      notificationEmail: '',
      comment: '',
    };

    const currentStandardizedTabUrl = standardizeUrlForPageSettings(window.location.href);

    turnOnRequestMode(store.getState().appModes, currentStandardizedTabUrl);
    chrome.storage.local.set({ ANNOTATION_REQUEST_FORM_DATA: formData }, () => {
      console.log('annotation request window opened!');
    });
    ppGa.annotationRequestFormOpened('rightMouseContextMenu', !selection);
  }
}

function annotateCommand() {
  /*
   * For now, do not check for being inside article.
   * Reason: checking ContextMenu API selection for being insideArticle is possible, but uncomfortable,
   * as context menu actions are handled in the separate background script.
   */
  const selection = tryGetSingleSelection();
  if (selection) {
    const annotationLocation = fullAnnotationLocation(selection);
    store.dispatch(setSelectionRange(annotationLocation));
    const selectionCenter = handlers.selector.currentSingleSelectionCenter();
    store.dispatch(showEditorAnnotation(selectionCenter.x, selectionCenter.y));
    ppGa.annotationAddFormOpened('rightMouseContextMenu');
  }
}

function XPathNormalizedRangeToRangyRange(xPathRange: XPathRange.NormalizedRange) {
  const rangyRange = rangy.createRange();
  const textNodes = xPathRange.textNodes();
  rangyRange.setStartBefore(textNodes[0]);
  rangyRange.setEndAfter(textNodes[textNodes.length - 1]);
  return rangyRange;
}

function fullAnnotationLocation(normalizedRange: XPathRange.NormalizedRange): AnnotationLocation {
  const rangyRange = XPathNormalizedRangeToRangyRange(normalizedRange);
  const quote = rangyRange.text();
  rangyRange.moveStart('character', -quoteContextWidth);
  rangyRange.moveEnd('character', quoteContextWidth);
  const quoteContext = rangyRange.text();
  return {
    range: normalizedRange.serialize(annotationRootNode(), `.${PPHighlightClass}`),
    quote,
    quoteContext,
  };
}
