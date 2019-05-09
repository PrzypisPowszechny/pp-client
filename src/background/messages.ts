// Message handlers

import { initTrackActiveTabId } from './tab';
import * as Sentry from '@sentry/browser';
import { ILocationData } from '../common/store/tabs/tab/annotations/actions';
import { AnnotationRequestAPIModel } from '../common/api/annotation-requests';
import { AnnotationAPIModel } from '../common/api/annotations';

export function returnExtensionCookie(request, sender, sendResponse) {
  if (request.action === 'GET_COOKIE') {
    chrome.cookies.get({
      url: PPSettings.API_URL,
      name: request.name,
    }, (cookie: chrome.cookies.Cookie) => {
      const error = chrome.runtime.lastError;
      if (error) {
        Sentry.captureException(error);
      }
      sendResponse({
        error,
        value: cookie,
      });
    });
  }
  return true;
}

export function setBadge(request, sender, sendResponse) {
  if (request.action === 'SET_BADGE') {
    chrome.browserAction.setBadgeText({ text: request.text, tabId: sender.tab.id });
    const error = chrome.runtime.lastError;
    if (error) {
      Sentry.captureException(error);
    }
    sendResponse({
      error,
      value: request.text,
    });
  }
}

export function returnCurrentTabId(request, sender, sendResponse) {
  if (request.action === 'GET_TAB_ID') {
    if (sender.tab) {
      // content script
      return sendResponse({ value: sender.tab.id });
    } else {
      // popup
      // there is an edge case (not very easy to find out) when the tab
      // is just becoming active with the popup icon click
      // in such cases current tab id will not have been set before receiving this message; request it asynchronously
      initTrackActiveTabId().then(tabId => sendResponse({ value: tabId }));
    }
    return true;
  }
}

export function tabLocateAnnotations(tabId, annotations: AnnotationAPIModel[] | AnnotationRequestAPIModel[]): Promise<ILocationData> {
  return new Promise(resolve => chrome.tabs.sendMessage(tabId, {
    action: 'TAB_LOCATE_ANNOTATIONS',
    payload: annotations,
  }, resolve));
}
