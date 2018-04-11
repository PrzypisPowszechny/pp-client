import { Highlighter, TextSelector } from 'core';
import * as utils from 'core/utils';

console.log('hi there!');

declare global {
  interface Window {
    przypis: any;
  }
}

init();

function init() {
  const textSelector = new TextSelector(document.body, handleSelect);
  //const highlighter = new Highlighter(document.body, null);

  console.log(textSelector);
  //console.log(highlighter);

  window.przypis = {
    textSelector,
    //highlighter,
    utils,
  };
}

function handleSelect(data, event) {
  console.log('data: ', data);
  console.log('event: ', event);
}
