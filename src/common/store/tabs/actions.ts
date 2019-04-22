// Special action called to initialize the tab before any other tab-related actions
export const TAB_INIT = 'TAB_INIT';
export const TAB_POPUP_INIT = 'TAB_POPUP_INIT';

export function tabInit(tabId: string) {
  return {
    type: TAB_INIT,
    payload: {
      tabId,
    },
  };
}

export function tabPopupInit(tabId: string) {
  return {
    type: TAB_POPUP_INIT,
    payload: {
      tabId,
    },
  };
}


export const DEBUG_TAB_POPUP_INIT = 'DEBUG_TAB_POPUP_INIT';
export const DEBUG_TAB_POPUP_IS_VALID = 'DEBUG_TAB_POPUP_IS_VALID';

export function debugTabPopupInit(tabId: string) {
  return {
    type: DEBUG_TAB_POPUP_INIT,
    payload: {
      tabId,
    },
  };
}

export function debugTabPopupIsValid(isValid: boolean) {
  return {
    type: DEBUG_TAB_POPUP_IS_VALID,
    payload: {
      isValid,
    },
  };
}
