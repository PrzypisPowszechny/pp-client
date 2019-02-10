/*
 * Module for maintaining current tab id so it can be synchronously accessed in modules where asynchronous calls
 * should not take place (reducers etc.)
 */

let currentTabId;

function initCurrentTabId() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      currentTabId = tabs[0].id;
      resolve(currentTabId);
      console.debug(`Initial tab id: ${currentTabId}`);
    });
  });
}

chrome.tabs.onActivated.addListener(setCurrentTabId);

function setCurrentTabId({ tabId, windowId }) {
  currentTabId = tabId;
  console.debug(`New tab id: ${currentTabId}`);
}

function getCurrentTabId() {
  if (currentTabId === undefined) {
    throw new Error('Current tab id not set');
  }
  return currentTabId;
}

export {
  initCurrentTabId,
  getCurrentTabId,
};
