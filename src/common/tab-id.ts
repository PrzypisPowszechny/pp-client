/*
 * Module that synchronously returns content script's / popup's tab id
 */

import { checkResponse } from './messages/utils';

let tabId;

function initializeTabId() {
  if (tabId !== undefined) {
    return Promise.resolve(tabId);
  }
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'GET_TAB_ID',
    }, (response) => {
      let error;
      [tabId, error] = checkResponse(response, 'initializeTabId');
      if (error) {
        reject(error);
      }
      resolve(tabId);
    });
  });
}

function getTabId() {
  // return tab id for the current content script / popup
  return tabId;
}

export {
  getTabId,
  initializeTabId,
};
