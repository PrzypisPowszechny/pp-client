import { AppModes } from './types';
import * as chromeKeys from '../../../../chrome-storage/keys';

export const MODIFY_APP_MODES = 'MODIFY_APP_MODES';

export function changeAppModes(appModes: AppModes) {
  return {
    type: MODIFY_APP_MODES,
    payload: {
      ...appModes,
    },
  };
}

export function loadAppModes() {
  return (dispatch, state) =>
    new Promise((resolve, reject) => {
      chrome.storage.local.get([
        chromeKeys.ANNOTATION_MODE_PAGES,
        chromeKeys.DISABLED_EXTENSION,
        chromeKeys.DISABLED_PAGES,
      ], (result) => {
        const newAppModes = {
          annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
          isExtensionDisabled: result[chromeKeys.DISABLED_EXTENSION] || false,
          disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
        };
        dispatch(changeAppModes(newAppModes));
        resolve();
      });
    });
}
