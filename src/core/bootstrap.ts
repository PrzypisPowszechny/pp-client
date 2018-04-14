import { Highlighter, TextSelector } from './index';

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
  // TODO logic
  console.log('selection: ', selection);
}
