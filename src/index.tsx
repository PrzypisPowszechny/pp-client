import React from 'react';
import { Provider } from 'react-redux';
import { readEndpoint } from 'redux-json-api';
import store from 'store';
import { initializeDocumentHandlers } from 'init/documentHandlers';
import { injectComponents } from 'init/components';
import chromeStorage from 'chrome-storage';

import './css/common/base.scss';
// semantic-ui minimum defaults for semantic-ui to work
import './css/common/pp-semantic-ui-reset.scss';
// New defaults/modifiers for some semantic-ui components
import './css/common/pp-semantic-ui-overrides.scss';

import './css/selection.scss';

// Set moment.js language for whole package
// Apparently, there is no clean solution to import only momentJS specific locale package
// and set it for future momentJS calls;
// (https://github.com/moment/moment/issues/2517)
import * as moment from 'moment';
moment.locale('pl');

import PPSettings from 'PPSettings.interface';
import * as chromeKeys from './chrome-storage/keys';
import initializeChromeStorageHandlers from './init/chromeStorageHandlers';
import { changeAppModes } from './store/appModes/actions';

// Declared in webpack.config through DefinePlugin
declare global {
  const PP_SETTINGS: PPSettings;
}

console.log('Przypis script working!');

function loadInitialData() {
  // This is our root request that needs to have part of the url (path) hardcoded
  store.dispatch(readEndpoint('/annotations?url=' + window.location.href));
}

/*
 * Map chrome storage keys to Redux store values
 */
export function loadDataFromChromeStorage() {
  chromeStorage.get([
    chromeKeys.ANNOTATION_MODE_PAGES,
    chromeKeys.DISABLED_EXTENSION,
    chromeKeys.DISABLED_PAGES,
  ], (result) => {
    const newAppModes = {
      annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
      disabledExtension: result[chromeKeys.DISABLED_EXTENSION] || false,
      disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
    };
    store.dispatch(changeAppModes(newAppModes));
  });
}

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  initializeDocumentHandlers();
  initializeChromeStorageHandlers();
  injectComponents();
  // load Data
  loadInitialData();
  loadDataFromChromeStorage();
}
