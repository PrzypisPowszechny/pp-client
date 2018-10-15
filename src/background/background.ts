import InstalledDetails = chrome.runtime.InstalledDetails;

console.log('Przypis background script!');

// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader
// (so it must be present at least in development)

// analytics
import ppGA from 'common/pp-ga/index';

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
      ppGA.extensionUpgraded(details.previousVersion);
      break;
    default:
      // ignore 'chrome_update' and 'shared_module_update'
      break;
  }
}

function returnExtensionCookie(request, sender, sendResponse) {
  if (request.action === 'GET_COOKIE') {
    chrome.cookies.get({
      url: PP_SETTINGS.API_URL,
      name: request.name,
    }, (cookie: chrome.cookies.Cookie) => {
      sendResponse({
        name: cookie.name,
        value: cookie.value,
      });
    });
  }
  return true;
}

ppGA.init();

chrome.contextMenus.create({
  title: 'Dodaj przypis',
  contexts: ['selection'],
  onclick: onContextMenuAnnotate,
});

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.setUninstallURL(PP_SETTINGS.SITE_URL + '/extension-uninstalled/');
chrome.runtime.onMessage.addListener(ppGA.sendEventFromMessage);
chrome.runtime.onMessage.addListener(returnExtensionCookie);
