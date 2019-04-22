import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis Powszechny popup script working!');

// Set script type by importing (so ALL other imports are executed afterwards)
import './meta';

// import Semantic-ui packages
import 'semantic-ui-css/semantic.min.css';

import '../../assets/icon.png';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

import BrowserPopupNavigator from './components/BrowserPopupNavigator';
import { debugTabPopupInit, debugTabPopupIsValid, tabPopupInit } from 'common/store/tabs/actions';
import { waitUntilPageLoaded, waitUntilFirstStoreUpdate } from '../common/utils/init';
import { waitUntilContentScriptShouldHaveConnected } from './messages';
import { selectTab } from '../common/store/tabs/selectors';
import { contentScriptWontLoad, setTabUrl } from '../common/store/tabs/tab/tabInfo/actions';
import { getCurrentTabUrl } from './utils';
import { parseUrlParams } from '../common/url';
import { initializeTabId } from '../common/store/tabs/tab-utils';

// Render the popup right away so the popup has constant width
// Make sure the store is ready to use at the component level
Promise.all([
  waitUntilPageLoaded(document),
])
  .then(() => {
    ReactDOM.render((
        <Provider store={store}>
          <BrowserPopupNavigator/>
        </Provider>
      ),
      document.body,
    );
  });

waitUntilFirstStoreUpdate(store)
  .then(async () => {
    console.log('Store hydrated from background page.');

    // initialize tab id for synchronous access in reducers
    const tabId = await initializeTabId();
    let isTabValid = true;

    const isDebugEmulatedTab = PPSettings.DEV && getEmulatedTabId();
    if (isDebugEmulatedTab) {
      await debugTabInit();
      // A valid existing tab should have been opened in emulated popup mode
      const logicalTab = selectTab(store.getState());
      isTabValid = Boolean(logicalTab);
      store.dispatch(debugTabPopupIsValid(isTabValid));
    } else {
      await tabInit(tabId);
    }

    // const {
    //   debugIsTabPopupEmulated,
    //   debugIsTabValid,
    // } = selectRealTab(store.getState()).tabInfo;

    if (isTabValid) {
      const logicalTabId = selectTab(store.getState()).tabInfo.tabId;
      await waitUntilContentScriptShouldHaveConnected(logicalTabId);
      if (!selectTab(store.getState()).tabInfo.contentScriptLoaded) {
        store.dispatch(contentScriptWontLoad());
      }
    }
  });

async function tabInit(tabId) {
  // initialize tab state in the store
  await store.dispatch(tabPopupInit(tabId));

  // if current tab url is not set (e.g. because content script has not been injected), set it
  const currentUrl = await getCurrentTabUrl();
  if (selectTab(store.getState()).tabInfo.currentUrl === null) {
    await store.dispatch(setTabUrl(currentUrl));
  }
}

function getEmulatedTabId() {
  return parseUrlParams(window.location.search)['devTabId'];
}

async function debugTabInit() {
  /*
   * A special dev entry to override tabId from URL params and emulate tabId
   */
  console.log('Loading tabId in an emulated popup mode from URL params');
  const params = parseUrlParams(window.location.search);
  console.log(params);
  const debugTabId = getEmulatedTabId();
  console.log('tabId', debugTabId);

  // initialize tab state in the store
  await store.dispatch(debugTabPopupInit(debugTabId));
}
