import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setAxiosConfig } from 'redux-json-api';

import store from 'store';

import App from 'containers/App';
import { initializeCoreHandlers } from 'core/bootstrap';

import './css/common/base.scss';
// semantic-ui minimum defaults for semantic-ui to work
import './css/common/pp-semantic-ui-reset.scss';
// New defaults/modifiers for some semantic-ui components
import './css/common/pp-semantic-ui-overrides.scss';

import './css/selection.scss';
import {showEditorNewAnnotation} from 'store/widgets/actions';

console.log('Przypis script working!');

function injectApp() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  store.dispatch(setAxiosConfig({
    baseURL: 'http://localhost:8000/api',
  }));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    documentContainer,
  );
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  initializeCoreHandlers();
  injectApp();
}
