import * as sentry from 'common/sentry';

sentry.init();

import React from 'react';
import { Provider } from 'react-redux';

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
import IPPSettings from 'common/PPSettings';
import chromeStorageHandlers from './handlers/chrome-storage-handlers';
import * as data from './init-data';
import highlightManager from './modules/highlight-manager';
import annotationLocator from './modules/annotation-locator';
import annotationEventHandlers from './handlers/annotation-event-handlers';
import appComponent from './modules/app-component';
import { configureAPIRequests } from './init-API';
import { annotationLocationNotifier } from './modules';
import { initializeTabId } from 'common/tab-id';
import store from '../popup/store';
import { updateTabInfo } from 'common/store/tabs/tab/tabInfo/actions';
import { TAB_INIT } from 'common/store/tabs/actions';
import { ScriptType, setScriptType } from 'common/meta';

// set script type for future introspection
setScriptType(ScriptType.contentScript);

moment.locale('pl');

// Declared in webpack.config through DefinePlugin
declare global {
  const PPSettings: IPPSettings;
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
  const waitUntilFirstUpdate = new Promise((resolve) => {
    // Wait until Redux store first update before initializing components
    // so the store has been initialized with default reducers
    const unsubscribe = store.subscribe(() => {
      unsubscribe(); // make sure to only fire once
      resolve();
    });
  });

  const waitUntilPageLoaded = new Promise((resolve) => {
    window.addEventListener('load', () => {
      resolve();
    });
  });

  Promise.all([
    waitUntilFirstUpdate,
    waitUntilPageLoaded,
    initializeTabId(),
  ]).then(() => {
    console.log('Store hydrated from background page.');
    // initialize tab state in the store
    store.dispatch({ type: TAB_INIT });
    return store.dispatch(updateTabInfo({
      currentUrl: window.location.href,
    }));
  }).then(() => {

    /*
     * Modules hooked to asynchronous events
     */
    annotationEventHandlers.init();
    chromeStorageHandlers.appModes.init();

    /*
     * Modules hooked to Redux store
     */
    // Injecting React components into DOM
    appComponent.init();
    // Locating annotations in DOM
    annotationLocator.init();
    // Saving the annotation location information to DOM for reads in selenium + in console
    annotationLocationNotifier.init();
    // Rendering annotations in DOM
    highlightManager.init();

    // API settings
    configureAPIRequests();

    // Optimization: load data from storage first, so annotations are not drawn before we know current application modes
    // (disabled extension mode and disabled page mode will erase them)
    data.loadFromChromeStorage()
      .then(data.loadFromAPI);

  });
}
