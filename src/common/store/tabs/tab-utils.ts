/*
 * Module that synchronously returns content script's / popup's tab id for use in reducers
 */

import { checkResponse } from '../../messages/utils';

let tabId;

/*
 * Get information on the tabId of this application script.
 * Leave it to the background script to return this script's id.
 *
 * The logic:
 * In case of content script, use the sender info to extract the tab id
 * In case of popup check which tab is currently active since popup can only be open for the active tab
 */
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
      console.debug('Retrieved tab Id', tabId);
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
