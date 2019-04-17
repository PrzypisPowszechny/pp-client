import { CONTENT_SCRIPT_LOADED, CONTENT_SCRIPT_WONT_LOAD, SET_TAB_URL } from './actions';
import { defaultWebsiteSupport } from '../../../../website-support';

const initialState = {
  contentScriptLoaded: false,
  contentScriptWontLoad: null,
  currentUrl: null,
  isSupported: null,
};

export interface ITabInfoState {
  contentScriptLoaded: boolean;
  contentScriptWontLoad: boolean;
  currentUrl: string;
  isSupported: boolean;
  notSupportedMessage?: string;
}

export function tabInfo(state = initialState, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}
