import { Range } from 'xpath-range';

import { mousePosition } from 'common/dom';
import store from 'store';
import { makeSelection, showMenu } from 'store/actions';

import { Highlighter, TextSelector } from '../core/index';
import { hideMenu } from 'store/widgets/actions';
import { outsideArticleClasses } from 'class_consts';
import highlights from './highlights';
import initChromeStorageHandlers from './chromeStorageHandlers';
import { selectModeForCurrentPage } from '../store/appModes/selectors';

let handlers;

export function initializeDocumentHandlers() {
  const highlighter = new Highlighter(document.body);
  const selector = new TextSelector(document.body, {
    onSelectionChange: selectionChangeCallback,
    outsideArticleClasses,
  });

  handlers = {
    highlighter,
    selector,
  };

  highlights.init(highlighter);
}

export function deinitializeCoreHandlers() {
  highlights.deinit();
}

function selectionChangeCallback(
  selection: Range.SerializedRange[],
  isInsideArticle: boolean,
  event) {

  const appModes = selectModeForCurrentPage(store.getState());
  if (appModes.isAnnotationMode) {
    if (selection.length === 0 || (selection.length === 1 && !isInsideArticle)) {
      // Propagate to the store only selections fully inside the article (e.g. not belonging to any of PP components)
      // When we need to react also to other, we can easily expand the textSelector reducer; for now it' too eager.
      store.dispatch(makeSelection(null));
      store.dispatch(hideMenu());
    } else if (selection.length === 1) {
      store.dispatch(makeSelection(selection[0]));
      store.dispatch(showMenu(mousePosition(event)));
    } else {
      console.warn('PP: more than one selected range is not supported');
    }
  }
}
