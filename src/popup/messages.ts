// Messages sent
import * as chromeKeys from '../common/chrome-storage/keys';
import { AnnotationAPIModel } from '../common/api/annotations';

export interface PopupAnnotationLocationData {
  hasLoaded: boolean;
  located: AnnotationAPIModel[];
  unlocated: AnnotationAPIModel[];
}

export function loadAnnotationLocationData(): Promise<PopupAnnotationLocationData> {
  // Since the popup appears on user demand, the data must be requested by popup
  // Request the annotation location data via message to the content script;
  // If the annotations have not been located yet, load them when they are ready via local chrome storage
  // Do not use chrome storage as the first source; the data may come for a different tab
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_ANNOTATIONS' }, (response) => {
        const annotationLocationData: PopupAnnotationLocationData = response;
        if (annotationLocationData && annotationLocationData.hasLoaded) {
          console.debug('Received annotations via direct response to the message', annotationLocationData);
          resolve(annotationLocationData);
        } else {
          chrome.storage.onChanged.addListener((changes, namespace) => {
            const locationDataChange = changes[chromeKeys.ANNOTATION_LOCATION];
            if (locationDataChange && locationDataChange.newValue.hasLoaded) {
              console.debug('Received annotations via browser storage', locationDataChange);
              resolve(locationDataChange.newValue);
            }
          });
        }
      });
    });
  });
}
