import tab from './tab/reducer';
import { retrieveActionTab } from './action-tab';
import { TAB_INIT } from './actions';

export default function tabs(state = {}, action) {
            console.log(action)

  const tabId = retrieveActionTab(action);
  // Only actions coming from content script or popup should modify the state
  if (tabId !== null && tabId !== undefined) {
    console.log(tabId);
    switch (action.type) {
      case TAB_INIT:
        // Reset the state
        return {
          ...state,
          [tabId]: tab(undefined, action),
        };
      default:
        const tabState = state[tabId];
        if (!tabState) {
          throw new Error('Tab not initialized on action call');
        }
        return {
          ...state,
          [tabId]: tab(tabState, action),
        };
    }
  } else {
    return state;
  }
}
