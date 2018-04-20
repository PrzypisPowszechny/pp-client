import {Range} from "xpath-range";
import {TextSelector, Highlighter} from "core/index";

/*
 * Example of selection becoming a highlight;
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
  window.textSelector = new TextSelector(document.body, handleSelect);
  window.highlighter = new Highlighter(document.body, null);
  window.highlighter.onHighlightEvent('mouseover', (e, annotationData) => {
    console.log(e);
    console.log(annotationData);
  });
}

function handleSelect(data: Range.SerializedRange[], event) {
  console.log('data: ', data);
  console.log('event: ', event);
  if (data) {
    if (data.length === 1) {
      console.log(data);
      window.highlighter.draw(1, data[0], {test: 'test'});

      // setTimeout(() => window.highlighter.undraw(1), 1000);
    } else {
      console.log('PP: more than one selected range is not supported');
    }

  }
}
