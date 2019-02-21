// Message handlers

import { getCurrentActiveTabId, initCurrentTabId } from './tab';
import tabId = chrome.devtools.inspectedWindow.tabId;

export function returnExtensionCookie(request, sender, sendResponse) {
  if (request.action === 'GET_COOKIE') {
    chrome.cookies.get({
      url: PPSettings.API_URL,
      name: request.name,
    }, (cookie: chrome.cookies.Cookie) => {
      if (cookie) {
        sendResponse({
          name: cookie.name,
          value: cookie.value,
        });
      } else {
        sendResponse({
          name: request.name,
          value: null,
        });
      }
    });
  }
  return true;
}

export function setBadge(request, sender, sendResponse) {
  if (request.action === 'SET_BADGE') {
    chrome.browserAction.setBadgeText({ text: request.text, tabId: sender.tab.id });
    sendResponse(request.text);
  }
}

export function returnCurrentTabId(request, sender, sendResponse) {
  if (request.action === 'GET_TAB_ID') {
    if (sender.tab) {
      // content script
      console.debug('content script');
      return sendResponse(sender.tab.id);
    } else {
      // popup
      console.debug('popup');
      // the current tab id may not have been initialized before this message; request it
      initCurrentTabId().then(sendResponse);
    }
    return true;
  }
}
