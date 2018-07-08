import { AppModes } from '../store/appModes/types';
import _filter from 'lodash/filter';
import * as chromeKeys from './keys';
import { standardizeUrlForPageSettings } from 'utils/url';
import mockStorage from './mock';

/*
 * This storage is an abstraction to use development and production environment equally
 *
 * Unfortunately, it turns out it cannot be done very cleanly;
 * some useful attributes (e.g. onChanged) are found directly in chrome.storage,
 * others (e.g. get) in chrome.storage.sync and chrome.storage.local
 * TODO: look for a better solution
 */
let storage;

// Firefox fix for chrome global interface
interface CustomWindow extends Window { chrome: any; }
declare let window: CustomWindow;
window.chrome = window.chrome || {};

// Mock storage for non-extension environment
if (typeof chrome.storage !== 'undefined') {
  if (PP_SETTINGS.DEV) {
    storage = chrome.storage.local;
  } else {
    // Saves to this storage go to Google servers and are synced between many Google sessions on different PCs.
    storage = chrome.storage.sync;
  }
  // Rewrite onChanged to allow get, set and onChanged as one object attributes;
  storage.onChanged = chrome.storage.onChanged;
} else {
  storage = mockStorage;
}

export default storage;

export function turnOffAnnotationMode(appModes: AppModes) {
  const currentStandardizedURL = standardizeUrlForPageSettings(window.location.href);
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedURL);
  storage.set({ [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages });
}
