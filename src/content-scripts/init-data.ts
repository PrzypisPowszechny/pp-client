import * as chromeKeys from 'common/chrome-storage/keys';
import { changeAppModes } from 'common/store/tabs/tab/appModes/actions';
import store from './store';
import chromeStorage from 'common/chrome-storage';
import * as endpoints from 'common/api/endpoints';
import { readEndpoint } from 'common/store/tabs/tab/api/actions';

export function loadFromAPI() {
  store.dispatch(readEndpoint(endpoints.ANNOTATIONS));
}

export function loadFromChromeStorage() {
  return new Promise((resolve, reject) => {
    chromeStorage.get([
      chromeKeys.ANNOTATION_MODE_PAGES,
      chromeKeys.REQUEST_MODE_PAGES,
      chromeKeys.DISABLED_EXTENSION,
      chromeKeys.DISABLED_PAGES,
    ], (result) => {
      const newAppModes = {
        annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
        requestModePages: result[chromeKeys.REQUEST_MODE_PAGES] || [],
        requestModeFormData: result[chromeKeys.ANNOTATION_REQUEST_FORM_DATA] || {},
        isExtensionDisabled: result[chromeKeys.DISABLED_EXTENSION] || false,
        disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
      };
      store.dispatch(changeAppModes(newAppModes));
      resolve();
    });
  });
}
