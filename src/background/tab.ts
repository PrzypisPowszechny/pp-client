/*
 * Module for maintaining current tab id so it can be synchronously accessed in modules where asynchronous calls
 * should not take place (reducers etc.)
 */

let currentTabId;
let listening;

function initCurrentTabId() {
  if(!listening) {
    chrome.tabs.onActivated.addListener(setCurrentTabId);
    listening = true;
  }
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


function setCurrentTabId({ tabId, windowId }) {
  currentTabId = tabId;
  console.debug(`New tab id: ${currentTabId}`);
}

function getCurrentActiveTabId() {
  if (currentTabId === undefined || currentTabId === null) {
    throw new Error('Current tab id not set');
  }
  return currentTabId;
}

export {
  initCurrentTabId,
  getCurrentActiveTabId,
};
