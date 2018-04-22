import { Range } from 'xpath-range';

import { mousePosition } from 'common/dom';
import store from 'store';
import { showMenu, textSelectedAction } from 'store/actions';

import { Highlighter, TextSelector } from './index';
import {hideMenu} from 'store/widgets/actions';

let handlers;

export function initializeCoreHandlers() {
  const highlighter = new Highlighter(document.body, null);
  const selector = new TextSelector(document.body, textSelectorCallback);

  handlers = {
    highlighter,
    selector,
  };
}

export function deinitializeCoreHandlers() {
  // ...?
}

function textSelectorCallback(selection: Range.SerializedRange[], event) {
  if (selection.length === 0) {
    store.dispatch(hideMenu());
  } else if (selection.length === 1) {
    store.dispatch(textSelectedAction(selection));
    store.dispatch(showMenu(mousePosition(event)));
  } else {
    console.warn('PP: more than one selected range is not supported');
  }
}
