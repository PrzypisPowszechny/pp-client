import { DEBUG_POPUP_INIT, POPUP_INIT } from '../../actions';

const initialState = {
  isEmulated: false,
};

export enum PopupMode {
  notEmulated = 'notEmulated',
  autonomousTab = 'autonomousTab',
  autonomousTabLinkedToTab = 'autonomousTabLinkedToTab',
}

export interface IPopupInfoState {
  isEmulated: boolean;
  debugEmulationMode?: PopupMode;

  // used in autonomousTabLinkedToTab
  debugLinkedTabId?: number;
  debugLinkedCorrectly?: boolean;
}

export default function popupInfo(state = initialState, action) {
  switch (action.type) {
    case POPUP_INIT:
      return {
        isEmulated: false,
      };
    case DEBUG_POPUP_INIT:
      // A special action to initiate an emulated tab in a debug mode
      if (!PPSettings.DEV) {
        throw Error(`${DEBUG_POPUP_INIT} action can only be dispatched in debug mode`)
      }
      const { emulationMode, tabId, linkedCorrectly } = action.payload;
      let debugLinkedTabId;
      if (emulationMode === PopupMode.autonomousTabLinkedToTab) {
        debugLinkedTabId = tabId;
      }
      return {
        ...state,
        isEmulated: true,
        debugEmulationMode: emulationMode,
        debugLinkedTabId,
        debugLinkedCorrectly: linkedCorrectly,
      };
    default:
      return state;
  }
}
