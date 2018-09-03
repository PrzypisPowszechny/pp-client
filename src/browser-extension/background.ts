import InstalledDetails = chrome.runtime.InstalledDetails;

console.log('Przypis background script!');

// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader

// analytics
import ppGA from '../pp-ga';

function onContextMenuAnnotate() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'ANNOTATE' });
  });
}

function onInstalled(details: InstalledDetails) {
  switch (details.reason) {
    case 'install':
      ppGA.extensionInstalled();
      break;
    case 'update':
      ppGA.extensionUpgradedFrom(details.previousVersion);
      break;
    default:
      // ignore 'chrome_update' and 'shared_module_update'
      break;
  }
}

function onSendGAEvent(request) {
  if (request.action === 'SEND_GA_EVENT') {
    ppGA.handleMessage(request);
  }
}

ppGA.init();

chrome.contextMenus.create({
  title: 'Dodaj przypis',
  contexts: ['selection'],
  onclick: onContextMenuAnnotate,
});

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.setUninstallURL(PP_SETTINGS.SITE_URL + '/extension-uninstalled');
chrome.runtime.onMessage.addListener(onSendGAEvent);
