import * as chromeKeys from 'common/chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';
import { AppModes } from 'content-scripts/store/appModes/types';
import chromeStorage from 'common/chrome-storage';

export default {
  appModes: {
    init,
    deinit,
  },
};

const storageKeysToAppMode = {
  [chromeKeys.DISABLED_EXTENSION]: 'isExtensionDisabled',
  [chromeKeys.ANNOTATION_MODE_PAGES]: 'annotationModePages',
  [chromeKeys.REQUEST_MODE_PAGES]: 'requestModePages',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

function init() {
  chromeStorage.onChanged.addListener((changes, namespace) => {
    for (const key of Object.keys(changes)) {
      if (storageKeysToAppMode[key]) {
          store.dispatch(
          changeAppModes({ [storageKeysToAppMode[key]]: changes[key].newValue } as AppModes),
        );
      }
    }
  });
}

function deinit() {
  // (todo)
}
