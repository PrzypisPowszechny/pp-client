export function getActiveTabUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0].url);
    });
  });
}

export function getActiveTabId(): Promise<number> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0].id);
    });
  });
}


export function getTabUrl(tabId: number): Promise<string> {
  return new Promise(
    (resolve) => chrome.tabs.get(
      tabId,
      (tab) => {
        if (chrome.runtime.lastError) {
          resolve(null);
        }
        resolve(tab ? tab.url : null);
      }
    )
  );
}
