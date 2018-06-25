import { AppModeReducer } from '../store/appModes/reducers';
import _filter from 'lodash/filter';
import * as chromeKeys from './keys';
import { standardizeUrlForPageSettings } from 'utils/url';
import mockStorage from './mock';

let storage;

// Mock storage for non-extension environment
if (typeof chrome.storage !== 'undefined') {
  if (PP_SETTINGS.DEV) {
    storage = chrome.storage.local;
  } else {
    // Saves to this storage go to Google servers and are synced between many Google sessions on different PCs.
    storage = chrome.storage.sync;
  }
} else {
  storage = mockStorage;
}

export default storage;

export function turnOffAnnotationMode(appModes: AppModeReducer) {
  const currentStandardizedURL = standardizeUrlForPageSettings(window.location.href);
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedURL);
  storage.set({ [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages });
}
