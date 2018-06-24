import * as chromeKeys from '../chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';
import chromeStorage from 'chrome-storage';

const storageKeysToAppMode = {
  [chromeKeys.DISABLED_EXTENSION]: 'disabledExtension',
  [chromeKeys.ANNOTATION_MODE_PAGES]: 'annotationModePages',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

export default function initializeChromeStorageHandlers() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    const newModes = {};
    for (const key of Object.keys(changes)) {
      store.dispatch(changeAppModes({ [storageKeysToAppMode[key]]: changes[key].newValue }));
    }
  });
}
