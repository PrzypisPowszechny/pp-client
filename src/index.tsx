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
}

function handleSelect(data, event) {
  console.log('data: ', data);
  console.log('event: ', event);
  if (data) {
    window.highlighter.draw(data);
  }
  // window.highlighter.undraw(data);
}
