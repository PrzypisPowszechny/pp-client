import React from 'react';
import { Provider } from 'react-redux';

import { initializeDocumentHandlers } from './init/documentHandlers';
import { injectComponents } from './init/components';

import '../css/common/base.scss';
// semantic-ui minimum defaults for semantic-ui to work
import 'css/common/pp-semantic-ui-reset.scss';
// New defaults/modifiers for some semantic-ui components
import 'css/common/pp-semantic-ui-overrides.scss';

import 'css/selection.scss';

// Set moment.js language for whole package
// Apparently, there is no clean solution to import only momentJS specific locale package
// and set it for future momentJS calls;
// (https://github.com/moment/moment/issues/2517)
import * as moment from 'moment';

moment.locale('pl');

import PPSettings from 'content-scripts/PPSettings.interface';
import initializeChromeStorageHandlers from './init/chromeStorageHandlers';
import { loadDataFromChromeStorage, loadInitialData } from './init/data';

// Declared in webpack.config through DefinePlugin
declare global {
  const PP_SETTINGS: PPSettings;
}

console.log('Przypis script working!');

/*
 * APPLICATION STATE POLICY
 * The application state is populated both from browser storage (appModes) and from the API (all other reducers)
 *
 * While API data changes are not listened to (no need),
 * browser storage is the communication channel between browser extension popup and the content script(s)
 * running on all open tabs, so beside loading data from browser storage we listen to changes to react to
 * popup settings changes in real time.
 * Browser storage is the source of truth for Redux store; we do not change state.appModes directly;
 * we commit changes to browser storage and recalculate state.appMode on storage change.
 */

const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  window.addEventListener('load', () => {
    initializeDocumentHandlers();
    initializeChromeStorageHandlers();
    injectComponents();

    // Optimization: load data from storage first, so annotations are not drawn before we know current application modes
    // (disabled extension mode and disabled page mode will erase them)
    loadDataFromChromeStorage().then(loadInitialData);
  });
}
