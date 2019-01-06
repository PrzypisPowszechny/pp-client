import * as chromeKeys from '../common/chrome-storage/keys';
import { AnnotationAPIModel } from '../common/api/annotations';
import Tab = chrome.tabs.Tab;

export interface PopupAnnotationLocationData {
  hasLoaded: boolean;
  located: AnnotationAPIModel[];
  unlocated: AnnotationAPIModel[];
}

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

export function loadAnnotationLocationData(): Promise<PopupAnnotationLocationData> {
  /*
   * The popup--content script messaging is technically one way;
   * On the one hand the popup appears on user demand, so the data may be requested by popup
   * On the other hand the data may not be loaded yet when the popup requests it;
   * In reality we need two-way communication.
   * This is accomplished through
   * - popup -> content script messaging
   * - content script->popup browser storage changes
   * The flow:
   * - wait until the current tab has been completely loaded
   * - request annotations via message
   * - when the annotations are ready, the content script will return them right away
   * - when they are not, subscribe to storage changes and return annotations when they have been loaded
   * todo: improve readability
   */
  return new Promise((resolve, reject) => {
    waitUntilCurrentTabLoaded().then((tab) => {

      console.debug('The active tab loading has been completed');
      chrome.tabs.sendMessage(tab.id,
        { action: 'GET_ANNOTATIONS' }, (response: PopupAnnotationLocationData) => {
          console.debug('The active tab has responded to GET_ANNOTATIONS', response);
          if (!response) {
            reject('No response from content script though the tab has loaded');
          }

          const annotationLocationData: PopupAnnotationLocationData = response;
          if (annotationLocationData && annotationLocationData.hasLoaded) {
            console.debug('Received annotations via direct response to the message', annotationLocationData);
            resolve(annotationLocationData);
          } else {
            chrome.storage.onChanged.addListener(function onStorageChange(changes, namespace) {
              const locationDataChange = changes[chromeKeys.ANNOTATION_LOCATION];
              console.log(locationDataChange);
              if (locationDataChange && locationDataChange.newValue.hasLoaded) {
                console.debug('Received annotations via browser storage', locationDataChange);
                chrome.storage.onChanged.removeListener(onStorageChange);
                resolve(locationDataChange.newValue);
              }
            });
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
