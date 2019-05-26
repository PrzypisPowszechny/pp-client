import * as Sentry from '@sentry/browser';
import React from 'react';
import { setAxiosConfig } from 'redux-json-api';

import 'moment/locale/pl.js';

import * as endpoints from 'common/api/resource-types';
import { configureAxios } from 'common/axios';
import { ScriptType, setScriptType } from 'common/meta';
import IPPSettings from 'common/PPSettings';
import * as sentry from 'common/sentry';
import { selectAccessToken, selectUser } from 'common/store/storage/selectors';
import { tabInit } from 'common/store/tabs/actions';
import { selectTab } from 'common/store/tabs/selectors';
import { initializeTabId } from 'common/store/tabs/tab-utils';
import { readEndpointWithHeaders } from 'common/store/tabs/tab/api/actions';
import { loadAppModes } from 'common/store/tabs/tab/appModes/actions';
import { contentScriptLoaded } from 'common/store/tabs/tab/tabInfo/actions';
import { waitUntilFirstStoreUpdate, waitUntilPageLoaded } from 'common/utils/init';
import 'css/common/pp-semantic-ui-overrides.scss';
// semantic-ui minimum defaults for semantic-ui to work
import 'css/common/pp-semantic-ui-reset.scss';
import 'css/selection.scss';

import { AnnotationLocator } from './annotations/AnnotationLocator';
import annotationEventHandlers from './handlers/annotation-event-handlers';
import chromeStorageHandlers from './handlers/chrome-storage-handlers';
// Set script type by importing (so ALL other imports are executed afterwards)
import './meta';
import { annotationLocationNotifier } from './modules';
import appComponent from './modules/app-component';
import highlightManager from './modules/highlight-manager';
import store from './store';

import { setAnnotationRequestStage } from '../common/store/tabs/tab/annotationRequests/actions';
import { AnnotationRequestsStage, AnnotationRequestsState } from '../common/store/tabs/tab/annotationRequests/types';
import { setAnnotationStage } from '../common/store/tabs/tab/annotations/actions';
import { AnnotationsStage } from '../common/store/tabs/tab/annotations/types';
import '../css/common/base.scss';

// New defaults/modifiers for some semantic-ui components

sentry.init();

// Set moment.js language for whole package
// based on https://medium.com/@michalozogan/how-to-split-moment-js-locales-to-chunks-with-webpack-de9e25caccea

// set script type for future introspection
setScriptType(ScriptType.contentScript);

// Declared in webpack.config through DefinePlugin
declare global {
  const PPSettings: IPPSettings;
}

console.log('Przypis script working!');

/*
 * APPLICATION STATE POLICY
 * The application state is populated mostly from global webext-redux global store
 *
 * The only legacy case where chrome storage is directly modified (not via syncing it with parts of redux store)
 * is app modes data.
 *
 * In this particular case:
 * browser storage is the communication channel between browser extension popup and the content script(s)
 * running on all open tabs, so beside loading data from browser storage we listen to changes to react to
 * popup settings changes in real time.
 * Browser storage is the source of truth for Redux store; we do not change state.appModes directly;
 * we commit changes to browser storage and recalculate state.appMode on storage change.
 */

waitUntilFirstStoreUpdate(store).then(async () => {
  console.debug('Store hydrated from background page.');

  const tabId = await initializeTabId();
  // initiate tab before any other actions
  await store.dispatch(tabInit(tabId, window.location.href));
  await store.dispatch(contentScriptLoaded());

  const loggedIn = Boolean(selectUser(store.getState()));
  if (!loggedIn) {
    return;
  }
  const { isSupported } = selectTab(store.getState()).tabInfo;

  if (isSupported) {
    await Promise.all([
      initData(),
      waitUntilPageLoaded(document),
    ]);
    initUI();
  }
});

async function initData() {
  // HTTP settings
  configureAxios(() => selectAccessToken(store.getState()));
  // Locating annotations in DOM
  // locator must be initialized already when annotations are loaded (it is used in a Redux epic)
  new AnnotationLocator(document, store).init();
  // Optimization: load app modes data from storage first
  // so annotations are not drawn before we know current application modes
  // (disabled extension mode and disabled page mode will erase them)

  await Promise.all([
    store.dispatch(setAxiosConfig({ baseURL: PPSettings.API_URL })), // settings for redux-json-api
    store.dispatch(loadAppModes()),
  ]);

  const currentUrl = selectTab(store.getState()).tabInfo.currentUrl;

  try {
    await store.dispatch(readEndpointWithHeaders(
      endpoints.ANNOTATIONS, { 'PP-SITE-URL': currentUrl },
    ));
  } catch (err) {
    console.debug(`Failed to fetch annotations: ${err.toString()}`);
    Sentry.captureException(err);
  } finally {
    store.dispatch(setAnnotationStage(AnnotationsStage.loaded));
  }

  try {
    await store.dispatch(readEndpointWithHeaders(
      endpoints.ANNOTATION_REQUESTS, { 'PP-SITE-URL': currentUrl },
    ));
  } catch (err) {
    console.debug(`Failed to fetch annotation requests: ${err.toString()}`);
    Sentry.captureException(err);
  } finally {
    store.dispatch(setAnnotationRequestStage(AnnotationRequestsStage.loaded));
  }
}

async function initUI() {
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

  if (PPSettings.DEV) {
    // Saving the annotation location information to DOM for reads in selenium + in console
    annotationLocationNotifier.init();
  }
  // Rendering annotations in DOM
  highlightManager.init();
}
