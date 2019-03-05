/*
 * Module for maintaining current tab id so it can be synchronously accessed in modules where asynchronous calls
 * should not take place (reducers etc.)
 */

let currentTabId;

function initTrackActiveTabId() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        currentTabId = tabs[0].id;
      } else {
        currentTabId = null;
      }
      resolve(currentTabId);
      console.debug(`Initial tab id: ${currentTabId}`);
    });
  });
}

chrome.tabs.onActivated.addListener(setActiveTabId);

function setActiveTabId({ tabId, windowId }) {
  currentTabId = tabId;
  console.debug(`New tab id: ${currentTabId}`);
}

function getActiveTabId() {
  if (currentTabId === undefined || currentTabId === null) {
    throw new Error('Current tab id not set');
  }
  return currentTabId;
}

export {
  initTrackActiveTabId,
  getActiveTabId,
};
