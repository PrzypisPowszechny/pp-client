// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)

import * as sentry from 'common/sentry';

sentry.init();

console.log('Przypis background script!');

// Set script type by importing (so ALL other imports such as redux are executed afterwards)
import './meta';

// initialize Redux store
import './store';

import InstalledDetails = chrome.runtime.InstalledDetails;
import { returnExtensionCookie, returnCurrentTabId, setBadge } from './messages';
import * as ppGaBg from 'common/pp-ga/bg';
import ppGa from 'common/pp-ga';
import { initTrackActiveTabId } from './tab';

import { configureAxios } from 'common/axios';
import store, { initStore } from './store/store';
import { selectAccessToken } from 'common/store/storage/selectors';
import { refreshTokenRoutine } from './auth';
import dashboardMessaging from 'background/dashboard-messaging';

function onContextMenuAnnotationRequest() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'ANNOTATION_REQUEST' });
  });
}

function contextMenuOnInstalled(details: InstalledDetails) {
  chrome.contextMenus.create({
    title: 'Poproś o przypis',
    contexts: ['selection'],
    onclick: onContextMenuAnnotationRequest,
  });
}

function ppGaOnInstalled(details: InstalledDetails) {
  switch (details.reason) {
    case 'install':
      ppGa.extensionInstalled();
      break;
    case 'update':
      ppGa.extensionUpgraded(details.previousVersion);
      break;
    default:
      // ignore 'chrome_update' and 'shared_module_update'
      break;
  }
}

initStore()
  .then(() => {
    console.debug('Store initialized');
    // start refreshing tokens no sooner than the store has been initialized from browser storage
    refreshTokenRoutine();
    // start listening for user queries no sooner than the store has been hydrated with user data from chrome storage
    dashboardMessaging.init();
  });

configureAxios(
  () => selectAccessToken(store.getState()),
);

/*
 * Basic extension settings
 */
chrome.runtime.setUninstallURL(PPSettings.SITE_URL + '/extension-uninstalled/');
chrome.runtime.onInstalled.addListener(contextMenuOnInstalled);

/*
 * Message handlers
 */
chrome.runtime.onMessage.addListener(setBadge);
chrome.runtime.onMessage.addListener(returnExtensionCookie);
chrome.runtime.onMessage.addListener(returnCurrentTabId);
/*
 * Init current tab id tracking
 */
initTrackActiveTabId();

/*
 * Google analytics
 */

ppGaBg.init().then(() => null);
chrome.runtime.onInstalled.addListener(ppGaOnInstalled);
chrome.runtime.onMessage.addListener(ppGaBg.sendEventFromMessage);

/*
 * Additional debug utilities
 */

if (PPSettings.DEV) {
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (request.action === 'DEV_BACKGROUND_PAGE_OPEN') {
        chrome.runtime.getBackgroundPage((window) => {
          chrome.tabs.create({
            url: window.location.href,
          });
        });
      }

      if (request.action === 'DEV_POPUP_OPEN') {
        chrome.tabs.create({
          url: './popup.html',
        });
      }
    },
  );
}
