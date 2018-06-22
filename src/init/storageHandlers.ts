import * as chromeKeys from '../chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';
import chromeStorage from 'chrome-storage';

/*
 * Map chrome storage keys to Redux store values
 */

const storageKeysToAppMode = {
  [chromeKeys.DISABLED_EXTENSION]: 'disabledExtension',
  [chromeKeys.ANNOTATION_MODE_PAGES]: 'annotationModePages',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

export default function initChromeStorageHandlers() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    // console.log(namespace);
    // console.log(changes);
    const newModes = {};
    for (const key of Object.keys(changes)) {
      store.dispatch(changeAppModes({ [storageKeysToAppMode[key]]: changes[key].newValue }));
    }
  });
}

export function hydrateStoreWithChromeStorage() {
  chromeStorage.get([
    chromeKeys.ANNOTATION_MODE_PAGES,
    chromeKeys.DISABLED_EXTENSION,
    chromeKeys.DISABLED_PAGES,
  ], (result) => {
    const newAppModes = {
      annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
      disabledExtension: result[chromeKeys.DISABLED_EXTENSION] || false,
      disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
    };
    store.dispatch(changeAppModes(newAppModes));
  });
}
