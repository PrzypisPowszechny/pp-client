import { Highlighter, TextSelector } from './index';
import store from 'store';
import { textSelectedAction } from 'store/actions';
import {Range} from "xpath-range";

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
  if (selection.length === 1) {
    store.dispatch(textSelectedAction(selection));
  } else {
    console.warn('PP: more than one selected range is not supported');
  }
}
