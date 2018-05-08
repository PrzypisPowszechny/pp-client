import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {  readEndpoint } from 'redux-json-api';
import store from 'store';

import App from 'containers/App';
import { initializeCoreHandlers } from 'init/handlers';
import { injectComponents } from 'init/components';

import './css/common/base.scss';
// semantic-ui minimum defaults for semantic-ui to work
import './css/common/pp-semantic-ui-reset.scss';
// New defaults/modifiers for some semantic-ui components
import './css/common/pp-semantic-ui-overrides.scss';

import './css/selection.scss';

import PPSettings from 'PPSettings.interface';

// Declared in webpack.config through DefinePlugin
declare global {
  const PP_SETTINGS: PPSettings;
}

console.log('Przypis script working!');

function loadInitialData() {
  // This is our root request that needs to have part of the url (path) hardcoded
  store.dispatch(readEndpoint('/annotations?url=' + window.location.href));
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  initializeCoreHandlers();
  injectComponents();
  loadInitialData();
}
