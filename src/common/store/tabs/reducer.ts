import tab from './tab/reducer';
import { retrieveActionTab } from './action-tab';
import { TAB_INIT, TAB_POPUP_INIT } from './actions';

export default function tabs(state = {}, action) {
  const tabId = retrieveActionTab(action);
  // Only actions coming from content script or popup should modify the state
  if (tabId !== null && tabId !== undefined) {
    let tabState;
    switch (action.type) {
      case TAB_INIT:
        // reset the state
        tabState = undefined;
        break;
      case TAB_POPUP_INIT:
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
