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

import { configureAxios } from '../common/axios';
import { getChromeCookie } from '../common/chrome-cookies';
import store, { initStore } from './store/store';
import { selectAccessToken, selectStorage } from '../common/store/storage/selectors';
import { refreshTokenRoutine } from './auth';
import dashboardMessaging from 'background/dashboard-messaging';

function onContextMenuAnnotate() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'ANNOTATE' });
  });
}

function onContextMenuAnnotationRequest() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'ANNOTATION_REQUEST' });
  });
}

function contextMenuOnInstalled(details: InstalledDetails) {
  chrome.contextMenus.create({
    title: 'Dodaj przypis',
    contexts: ['selection'],
    onclick: onContextMenuAnnotate,
  });

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
    // start refreshing tokens no sooner than the store has been initialized from browser storage
    refreshTokenRoutine();
    // start listening for user queries no sooner than the store has been hydrated with user data from chrome storage
    dashboardMessaging.init();
  });

configureAxios(
  name => getChromeCookie(PPSettings.API_URL, name).then(cookie => cookie.value),
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
