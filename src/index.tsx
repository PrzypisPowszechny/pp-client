// import IPPSettings from './PPSettings.interface';
// declare const PP_SETTINGS: IPPSettings;

// import Widget from "./components/Widget";
// import Editor from "./containers/editor/Editor";

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import App from "./containers/App";
import {showEditor, hideEditor, setEditor} from "./actions/index";

console.log('Przypis script working!');

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function injectApp() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    documentContainer
  );
  store.dispatch(setEditor(true, 100, 200))

}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  injectApp();
}
