import { AppModes } from 'content-scripts/store/appModes/types';
import _filter from 'lodash/filter';
import * as chromeKeys from './keys';
import { standardizeUrlForPageSettings } from 'common/url';
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
interface CustomWindow extends Window {
  chrome: any;
}

declare let window: CustomWindow;
window.chrome = window.chrome || {};

// Mock storage for non-extension environment
if (typeof chrome.storage !== 'undefined') {
  storage = chrome.storage.local;
  // Rewrite onChanged to allow get, set and onChanged as one object attributes;
  storage.onChanged = chrome.storage.onChanged;
} else {
  storage = mockStorage;
}

export default storage;

export function turnOffAnnotationMode(appModes: AppModes, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedTabUrl);
  storage.set({ [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages });
}

export function turnOffRequestMode(appModes: AppModes, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  const newRequestModePages = _filter(appModes.requestModePages, url => url !== currentStandardizedTabUrl);
  storage.set({ [chromeKeys.REQUEST_MODE_PAGES]: newRequestModePages });
}

export function turnOnRequestMode(appModes: Partial<AppModes>, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  // let newRequestModePages = appModes.requestModePages;
  const newRequestModePages = [...appModes.requestModePages, currentStandardizedTabUrl];

  // switch off annotation mode
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedTabUrl);
  storage.set({
    [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
    [chromeKeys.REQUEST_MODE_PAGES]: newRequestModePages
  });
}
