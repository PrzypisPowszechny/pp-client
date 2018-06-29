import * as chromeKeys from '../chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';
import { AppModeReducer } from '../store/appModes/reducers';
import chromeStorage from 'chrome-storage';

const storageKeysToAppMode = {
  [chromeKeys.DISABLED_EXTENSION]: 'isExtensionDisabled',
  [chromeKeys.ANNOTATION_MODE_PAGES]: 'annotationModePages',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

export default function initializeChromeStorageHandlers() {
  chromeStorage.onChanged.addListener((changes, namespace) => {
    for (const key of Object.keys(changes)) {
      store.dispatch(
        changeAppModes({ [storageKeysToAppMode[key]]: changes[key].newValue } as AppModeReducer),
      );
    }
  });
}
