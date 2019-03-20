import Tab = chrome.tabs.Tab;

// this will be useful soon
export function waitUntilCurrentTabLoaded(): Promise<Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.status === 'complete') {
        resolve(activeTab);
      }
      chrome.tabs.onUpdated.addListener(function listener(anyTabId, info, updatedTab) {
        if (info.status === 'complete' && anyTabId === activeTab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(updatedTab);
        }
      });
    });
  });
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
