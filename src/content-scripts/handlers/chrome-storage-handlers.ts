import * as chromeKeys from 'common/chrome-storage/keys';
import { changeAppModes } from 'common/store/tabs/tab/appModes/actions';
import store from '../store';
import { AppModes } from 'common/store/tabs/tab/appModes/types';
import { selectModeForCurrentPage } from 'common/store/tabs/tab/appModes/selectors';
import selector from './annotation-event-handlers';

export default {
  appModes: {
    init,
    deinit,
  },
};

const storageKeysToAppMode = {
  [chromeKeys.DISABLED_EXTENSION]: 'isExtensionDisabled',
  [chromeKeys.ANNOTATION_MODE_PAGES]: 'annotationModePages',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

function init() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (const key of Object.keys(changes)) {
      const storeKey = storageKeysToAppMode[key];
      switch (storeKey) {
        case 'annotationModePages':
          // Check if annotation mode has just been turned on and display annotation menu in such case
          const isAnnotationMode = selectModeForCurrentPage(store.getState()).isAnnotationMode;
          store.dispatch(
            changeAppModes({ [storeKey]: changes[key].newValue } as AppModes),
          );
          const newIsAnnotationMode = selectModeForCurrentPage(store.getState()).isAnnotationMode;
          if (!isAnnotationMode && newIsAnnotationMode) {
            // dispatch changes to Redux store
            selector.displayAnnotationMenuForCurrentSelection();
          }
          break;
        default:
          if (storeKey) {
            store.dispatch(
              changeAppModes({ [storeKey]: changes[key].newValue } as AppModes),
            );
          }
      }
    }
  });
}

function deinit() {
  // (todo)
}
