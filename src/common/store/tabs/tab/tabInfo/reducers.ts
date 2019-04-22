import { CONTENT_SCRIPT_LOADED, CONTENT_SCRIPT_WONT_LOAD, SET_TAB_URL } from './actions';
import { defaultWebsiteSupport } from '../../../../website-support';
import { DEBUG_TAB_POPUP_INIT, DEBUG_TAB_POPUP_IS_VALID, TAB_INIT, TAB_POPUP_INIT } from '../../actions';

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
  switch (action.type) {
    case TAB_INIT:
    case TAB_POPUP_INIT:
      return {
        ...state,
        tabId: action.payload.tabId,
      }
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
      };
    case SET_TAB_URL:
      const { currentUrl } = action.payload;
      const notSupportedMessage = defaultWebsiteSupport.isBlacklisted(currentUrl);
      const isSupported = notSupportedMessage === null;
      return {
        ...state,
        currentUrl,
        isSupported,
        notSupportedMessage,
      };
    case DEBUG_TAB_POPUP_INIT:
      // A special action to initiate an emulated tab in a debug mode
      if (!PPSettings.DEV) {
        throw Error(`${DEBUG_TAB_POPUP_INIT} action can only be dispatched in debug mode`)
      }
      return {
        ...state,
        tabId: action.payload.tabId,
        debugIsTabPopupEmulated: true,
      };
    case DEBUG_TAB_POPUP_IS_VALID:
      if (!PPSettings.DEV) {
        throw Error(`${DEBUG_TAB_POPUP_INIT} action can only be dispatched in debug mode`)
      }
      return {
        ...state,
        debugIsTabValid: action.payload.isValid,
      };
    default:
      return state;
  }
}
