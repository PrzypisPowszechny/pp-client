// Message handlers

import { getCurrentTabId } from './tab';

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
      sendResponse(sender.tab.id);
    } else {
      // popup
      console.debug('popup');
      sendResponse(getCurrentTabId());
    }
  }
}
