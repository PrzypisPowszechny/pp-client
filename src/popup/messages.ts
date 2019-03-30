import Tab = chrome.tabs.Tab;
import { selectTab } from '../common/store/tabs/selectors';

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

const timeoutBeforeCSConnects = 500;

export function waitUntilContentScriptShouldHaveConnected(): Promise<null> {
  return new Promise(resolve =>
    waitUntilCurrentTabLoaded().then(
      () => setTimeout(resolve, timeoutBeforeCSConnects),
    )
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
