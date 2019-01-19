// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)

import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis background script!');

import InstalledDetails = chrome.runtime.InstalledDetails;
import { returnExtensionCookie, setBadge } from './messages';
import * as ppGaBg from 'common/pp-ga/bg';
import ppGa from 'common/pp-ga';

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
 * Google analytics
 */

ppGaBg.init().then( () => null);
chrome.runtime.onInstalled.addListener(ppGaOnInstalled);
chrome.runtime.onMessage.addListener(ppGaBg.sendEventFromMessage);
