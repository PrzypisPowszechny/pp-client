import { AppModes } from 'common/store/tabs/tab/appModes/types';
import _filter from 'lodash/filter';
import * as chromeKeys from './keys';
import { standardizeUrlForPageSettings } from 'common/url';

// Firefox fix for chrome global interface
interface CustomWindow extends Window {
  chrome: any;
}

declare let window: CustomWindow;
window.chrome = window.chrome || {};

export function turnOffAnnotationMode(appModes: AppModes, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedTabUrl);
  chrome.storage.local.set({ [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages });
}

export function turnOffRequestMode(appModes: AppModes, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  const newRequestModePages = _filter(appModes.requestModePages, url => url !== currentStandardizedTabUrl);
  chrome.storage.local.set({ [chromeKeys.REQUEST_MODE_PAGES]: newRequestModePages });
}

export function turnOnRequestMode(appModes: Partial<AppModes>, currentTabUrl: string) {
  const currentStandardizedTabUrl = standardizeUrlForPageSettings(currentTabUrl);
  // let newRequestModePages = appModes.requestModePages;
  const newRequestModePages = [...appModes.requestModePages, currentStandardizedTabUrl];

  // switch off annotation mode
  const newAnnotationModePages = _filter(appModes.annotationModePages, url => url !== currentStandardizedTabUrl);
  chrome.storage.local.set({
    [chromeKeys.ANNOTATION_MODE_PAGES]: newAnnotationModePages,
    [chromeKeys.REQUEST_MODE_PAGES]: newRequestModePages
  });
}
