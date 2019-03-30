import { UPDATE_TAB_INFO } from './actions';
import { defaultWebsiteSupport } from '../../../../website-support';

const initialState = {
  currentUrl: '',
};

export interface ITabInfoState {
  currentUrl: string;
  isSupported: boolean;
  notSupportedMessage: string;
}

export function tabInfo(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TAB_INFO:
      const { currentUrl } = action.payload;
      const notSupportedMessage = defaultWebsiteSupport.isBlacklisted(currentUrl);
      const isSupported = notSupportedMessage === null;
      return {
        currentUrl,
        isSupported,
        notSupportedMessage,
      };
    default:
      return state;
  }
}
