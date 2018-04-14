import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import App from "./containers/App";
import {showEditor, hideEditor, setEditor} from "./actions/index";
import TextSelector from "./core/TextSelector";

import './css/common/base.scss';
// semantic-ui minimum defaults for semantic-ui to work
import './css/common/pp-semantic-ui-reset.scss';
// New defaults/modifiers for some semantic-ui components
import './css/common/pp-semantic-ui-overrides.scss';

import './css/selection.scss';

import Highlighter from './core/Highlighter';
import {Range} from "xpath-range";

// import IPPSettings from './PPSettings.interface';
// declare const PP_SETTINGS: IPPSettings;

console.log('Przypis script working!');

declare global {
  interface Window {
    textSelector: TextSelector;
    highlighter: Highlighter;
  }
}

function injectApp() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    documentContainer,
  );
  store.dispatch(setEditor(true, 300, 500));

}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  injectApp();
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
  // window.highlighter.undraw(data);
}
