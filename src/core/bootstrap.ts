import { Highlighter, TextSelector } from './index';
import store from 'store';
import { textSelectedAction } from 'store/actions';

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

function textSelectorCallback(selection, event) {
  store.dispatch(textSelectedAction(selection));
}