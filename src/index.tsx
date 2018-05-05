import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setAxiosConfig, readEndpoint } from 'redux-json-api';

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
import {getAnnotationUrl} from './utils/url'

console.log('Przypis script working!');

function injectApp() {
  const documentContainer = document.createElement('div');
  documentContainer.id = 'pp-document-container';
  window.document.body.appendChild(documentContainer);

  // TODO: 1. wrap those dispatches into dedicated function to make this code more separate and descriptive
  // TODO: 2. this url is hardcoded now, but should be imported from config
  store.dispatch(setAxiosConfig({
    baseURL: 'http://localhost:8000/api',
  }));

  // This our root request that need to have part of the url (path) hardcoded
  store.dispatch(readEndpoint('/annotations?url=' + getAnnotationUrl()));

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
