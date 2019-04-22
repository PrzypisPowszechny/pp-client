import Tab = chrome.tabs.Tab;

export function waitUntilTabLoaded(tabId): Promise<Tab> {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      console.log('dff');
      if (tab.status === 'complete') {
        resolve(tab);
      }
      chrome.tabs.onUpdated.addListener(function listener(anyTabId, info, updatedTab) {
        if (info.status === 'complete' && anyTabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(updatedTab);
        }
      });
    });
  });
}

const timeoutBeforeCSConnects = 500;

export function waitUntilContentScriptShouldHaveConnected(tabId): Promise<null> {
  return new Promise(resolve =>
    waitUntilTabLoaded(tabId).then(
      () => setTimeout(resolve, timeoutBeforeCSConnects),
    ),
  );
}

export function sendScrollToAnnotation(annotationId: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id,
      {
        action: 'SCROLL_TO_ANNOTATION',
        payload: { annotationId },
      });
  });
}
