import * as chromeKeys from 'common/chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';
import { AppModes } from 'content-scripts/store/appModes/types';
import chromeStorage from 'common/chrome-storage';
import { selectModeForCurrentPage } from '../store/appModes/selectors';
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
  [chromeKeys.REQUEST_MODE_PAGES]: 'requestModePages',
  [chromeKeys.ANNOTATION_REQUEST_FORM_DATA]: 'requestModeFormData',
  [chromeKeys.DISABLED_PAGES]: 'disabledPages',
};

function init() {
  chromeStorage.onChanged.addListener((changes, namespace) => {
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
