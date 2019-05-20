import { retrieveLogicalActionTab } from './action-tab';
import { DEBUG_POPUP_INIT, POPUP_INIT, TAB_INIT } from './actions';
import tab from './tab/reducer';

export default function tabs(state = {}, action) {
  const tabId = retrieveLogicalActionTab(action, state);
  // Only actions coming from content script or popup should modify the state
  if (tabId !== null && tabId !== undefined) {
    console.debug(`Received action coming from tab ${tabId}`);
    let tabState;
    switch (action.type) {
      case TAB_INIT:
        // reset the state
        tabState = undefined;
        break;
      case POPUP_INIT:
      case DEBUG_POPUP_INIT:
        // initiate but do not reset if already initiated
        tabState = state[tabId];
        break;
      default:
        // run an action on the initiated tab
        tabState = state[tabId];
        if (!tabState) {
          throw new Error('Tab not initialized on action call');
        }
    }
    return {
      ...state,
      [tabId]: tab(tabState, action),
    };

  } else {
    return state;
  }
}
