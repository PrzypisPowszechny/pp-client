import * as chromeKeys from '../chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';

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
