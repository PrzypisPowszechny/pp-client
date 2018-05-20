import { Range } from 'xpath-range';

import { mousePosition } from 'common/dom';
import store from 'store';
import { makeSelection, showMenu } from 'store/actions';

import { Highlighter, TextSelector } from '../core/index';
import { hideMenu } from 'store/widgets/actions';
import { outsideArticleClasses } from '../consts';

let handlers;

export function initializeCoreHandlers() {
  const highlighter = new Highlighter(document.body, null);
  const selector = new TextSelector(document.body, {
    onSelectionChange: selectionChangeCallback,
    outsideArticleClasses,
  });

  handlers = {
    highlighter,
    selector,
  };
}

export function deinitializeCoreHandlers() {
  // ...?
}

function selectionChangeCallback(
  selection: Range.SerializedRange[],
  isInsideArticle: boolean,
  event) {
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
