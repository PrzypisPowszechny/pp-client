import { CONTENT_SCRIPT_LOADED, CONTENT_SCRIPT_WONT_LOAD, SET_TAB_URL } from './actions';
import { defaultWebsiteSupport } from '../../../../website-support';
import { DEBUG_POPUP_INIT, DEBUG_POPUP_LINKED, TAB_INIT, POPUP_INIT } from '../../actions';

const initialState = {
  tabId: null,
  contentScriptLoaded: false,
  contentScriptWontLoad: null,
  currentUrl: null,
  isSupported: null,
};

export interface ITabInfoState {
  tabId: string;
  contentScriptLoaded: boolean;
  contentScriptWontLoad: boolean;
  currentUrl: string;
  isSupported: boolean;
  notSupportedMessage?: string;

  debugIsTabPopupEmulated?: boolean;
  debugIsTabValid?: boolean;
}

export function tabInfo(state = initialState, action) {
  if (!PPSettings.DEV && action.type === DEBUG_POPUP_INIT) {
    throw Error(`${DEBUG_POPUP_INIT} action can only be dispatched in debug mode`);
  }
  switch (action.type) {
    case TAB_INIT:
    case POPUP_INIT:
    case DEBUG_POPUP_INIT:
      const { tabId, currentUrl } = action.payload;
      if (state.currentUrl && state.currentUrl !== currentUrl) {
        throw new Error(`Current tab url already set to ${state.currentUrl}. Cannot set it to ${currentUrl}`);
      }
      const notSupportedMessage = defaultWebsiteSupport.isBlacklisted(currentUrl);
      const isSupported = notSupportedMessage === null;
      return {
        ...state,
        tabId,
        currentUrl,
        isSupported,
        notSupportedMessage,
      };
    case CONTENT_SCRIPT_WONT_LOAD:
      return {
        ...state,
        contentScriptLoaded: false,
        contentScriptWontLoad: true,
      };
    case CONTENT_SCRIPT_LOADED:
      return {
        ...state,
        contentScriptLoaded: true,
        contentScriptWontLoad: false,
      };
    default:
      return state;
  }
}
