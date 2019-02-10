// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)

import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis background script!');

// initialize Redux store
import './store';

import InstalledDetails = chrome.runtime.InstalledDetails;
import { returnExtensionCookie, returnCurrentTabId, setBadge } from './messages';
import * as ppGaBg from 'common/pp-ga/bg';
import ppGa from 'common/pp-ga';
import { initCurrentTabId } from './tab';

import { configureAxios } from '../common/axios';

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

function getCookie(name: string): Promise<string | null> {
  return new Promise(resolve => chrome.cookies.get({
    url: PPSettings.API_URL,
    name,
  }, (cookie: chrome.cookies.Cookie) => {
    if (cookie) {
      resolve(cookie.value);
    } else {
      resolve(null);
    }
  }));
}

function getCurrentTabUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs[0]);
      resolve(tabs[0].url);
    });
  });
}

// TODO refactor
// TODO retrieve URL in a different way (this IS NOT correct)
configureAxios(
  getCurrentTabUrl,
  getCookie,
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

/*
 * Init current tab id tracking
 */

initCurrentTabId();
chrome.runtime.onMessage.addListener(returnCurrentTabId);

/*
 * Google analytics
 */

ppGaBg.init().then(() => null);
chrome.runtime.onInstalled.addListener(ppGaOnInstalled);
chrome.runtime.onMessage.addListener(ppGaBg.sendEventFromMessage);
