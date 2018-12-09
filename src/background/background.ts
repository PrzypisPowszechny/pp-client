// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)

import * as sentry from '../common/sentry';

sentry.init();

console.log('Przypis background script!');

import InstalledDetails = chrome.runtime.InstalledDetails;
import { openAnnotationForm, returnExtensionCookie, setBadge } from './messages';
import ppGA from 'common/pp-ga/index';

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

function ppGAOnInstalled(details: InstalledDetails) {
  switch (details.reason) {
    case 'install':
      ppGA.extensionInstalled();
      break;
    case 'update':
      ppGA.extensionUpgraded(details.previousVersion);
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
chrome.runtime.onMessage.addListener(openAnnotationForm);

/*
 * Google analytics
 */

ppGA.init();
chrome.runtime.onInstalled.addListener(ppGAOnInstalled);
chrome.runtime.onMessage.addListener(ppGA.sendEventFromMessage);



