import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as sentry from 'common/sentry';
import { debugTabPopupInit, tabPopupInit } from 'common/store/tabs/actions';
import { selectTab } from 'common/store/tabs/selectors';
import { initializeTabId } from 'common/store/tabs/tab-utils';
import { PopupMode } from 'common/store/tabs/tab/popupInfo';
import { contentScriptWontLoad } from 'common/store/tabs/tab/tabInfo/actions';
import { parseUrlParams } from 'common/url';
import { waitUntilFirstStoreUpdate, waitUntilPageLoaded } from 'common/utils/init';
import 'css/common/pp-semantic-ui-overrides.scss';
import 'css/common/pp-semantic-ui-reset.scss';

import BrowserPopupNavigator from './components/BrowserPopupNavigator';
import { waitUntilContentScriptShouldHaveConnected } from './messages';
import './meta';
import store from './store';
import { getActiveTabId, getActiveTabUrl, getTabUrl } from './utils';

import '../../assets/icon.png';

sentry.init();

console.log('Przypis Powszechny popup script working!');

// Set script type by importing (so ALL other imports are executed afterwards)

// semantic-ui minimum defaults
// these are prerequisites for any semantic ui components as well as reasonable defaults for our own style
// shared with content script styles
// New defaults/modifiers for some semantic-ui components

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
    const popupMode = await getPopupMode();
    let tabUrl;
    switch (popupMode) {
      case PopupMode.notEmulated:
        // Get main page URL (for which the popup is opened)
        tabUrl = await getActiveTabUrl();
        await store.dispatch(tabPopupInit(tabId, tabUrl));
        await pollForContentScriptLoaded();
        break;
      case PopupMode.autonomousTabLinkedToTab:
        // Get URL of the tab to which the popup is linked
        console.log('Emulated popup mode: autonomous tab linked to a tab');
        const debugTabId = getEmulatedTabId();
        console.log(`Parsed URL params: linked tabId ${debugTabId}`);
        tabUrl = await getTabUrl(debugTabId);
        // check if the tab has already been initiated
        const linkedToTab = Boolean(store.getState().tabs[debugTabId]);
        console.log(`Linked to tab state: ${linkedToTab}`);
        // initialize tab state in the store
        await store.dispatch(debugTabPopupInit(debugTabId, tabUrl, PopupMode.autonomousTabLinkedToTab,
          linkedToTab));
        // The tab must exist to wait until it has been loaded
        if (linkedToTab) {
          await pollForContentScriptLoaded();
        }
        break;
      case PopupMode.autonomousTab:
        console.log('Emulated popup mode: autonomous tab');
        // Content script does not really exist; It's like the content script was simply not loaded
        tabUrl = 'www.autonomousEmulatedTab.popup';
        await store.dispatch(debugTabPopupInit(await getActiveTabId(), tabUrl, PopupMode.autonomousTab));
        await pollForContentScriptLoaded();
        break;
    }
  });

async function pollForContentScriptLoaded() {
  const logicalTabId = selectTab(store.getState()).tabInfo.tabId;
  await waitUntilContentScriptShouldHaveConnected(logicalTabId);
  if (!selectTab(store.getState()).tabInfo.contentScriptLoaded) {
    return await store.dispatch(contentScriptWontLoad());
  }
}

export async function getPopupMode() {
  if (!PPSettings.DEV) {
    return PopupMode.notEmulated;
  }

  // is popup opened normally on extension icon click? (unlike opened in a tab like a usual page)
  const window: any = await new Promise(resolve => chrome.windows.getCurrent({}, resolve));
  const currentTab = await new Promise (resolve => chrome.tabs.getCurrent(resolve));
  if (!currentTab) {
    return PopupMode.notEmulated;
  }

  if (getEmulatedTabId()) {
    return PopupMode.autonomousTabLinkedToTab;
  } else {
    return PopupMode.autonomousTab;
  }
}

function getEmulatedTabId(): number {
  const tabId = Number(parseUrlParams(window.location.search).devTabId);
  if (isNaN(tabId)) {
    return null;
  }
  return tabId;
}
