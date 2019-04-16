
export const SET_TAB_URL = 'SET_TAB_URL';
export const CONTENT_SCRIPT_LOADED = 'CONTENT_SCRIPT_LOADED';
export const CONTENT_SCRIPT_WONT_LOAD = 'CONTENT_SCRIPT_WONT_LOAD';

export function setTabUrl(currentUrl: string) {
  return {
    type: SET_TAB_URL,
    payload: {
      currentUrl,
    },
  };
}

export function contentScriptLoaded() {
  return {
    type: CONTENT_SCRIPT_LOADED,
  };
}

export function contentScriptWontLoad() {
  return {
    type: CONTENT_SCRIPT_WONT_LOAD,
  };
}
