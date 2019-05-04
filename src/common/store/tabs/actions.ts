// Special action called to initialize the tab before any other tab-related actions
import { PopupMode } from './tab/popupInfo/reducers';

export const TAB_INIT = 'TAB_INIT';
export const POPUP_INIT = 'POPUP_INIT';

export function tabInit(tabId: string, currentUrl: string ) {
  return {
    type: TAB_INIT,
    payload: {
      tabId,
      currentUrl,
    },
  };
}

export function tabPopupInit(tabId: string, currentUrl: string) {
  return {
    type: POPUP_INIT,
    payload: {
      tabId,
      currentUrl,
    },
  };
}

export const DEBUG_POPUP_INIT = 'DEBUG_POPUP_INIT';
export const DEBUG_POPUP_LINKED = 'DEBUG_POPUP_LINKED';

export function debugTabPopupInit(
  tabId: number,
  currentUrl: string,
  emulationMode: PopupMode,
  linkedCorrectly?: boolean,
) {
  return {
    type: DEBUG_POPUP_INIT,
    payload: {
      tabId,
      currentUrl,
      emulationMode,
      linkedCorrectly,
    },
  };
}
