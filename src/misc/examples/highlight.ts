import { Range as XPathRange } from 'xpath-range';

import { Highlighter, TextSelector } from 'content-scripts/utils';
import 'css/selection.scss';

/*
 * Example of selection becoming a highlight;
 * This module can be selected as the application entry point
 */

declare global {
  interface Window {
    textSelector: TextSelector;
    highlighter: Highlighter;
  }
}

function initializeHighlightPlayground() {
  initializeCoreHandlers();
}

function initializeCoreHandlers() {
  window.textSelector = new TextSelector(document.body, { onMouseUp: handleSelect });
  window.highlighter = new Highlighter(document.body, null);
  window.highlighter.onHighlightEvent('mouseover', (e, annotationData) => {
    console.log(e);
  });
}

function handleSelect(data: XPathRange.NormalizedRange[], event) {
  if (data) {
    if (data.length === 1) {
      window.highlighter.draw(1, data[0].serialize(document.body), { test: 'test' });

      // setTimeout(() => window.highlighter.undraw(1), 1000);
    } else {
      console.log('PP: more than one selected range is not supported');
    }

  }
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  initializeHighlightPlayground();
}
