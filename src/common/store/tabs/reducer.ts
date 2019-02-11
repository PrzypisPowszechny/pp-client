import tab from './tab/reducer';
import { retrieveAnyActionTab } from './action-tab';

export default function tabs(state = {}, action) {
  console.log(action);
  // Only actions coming from content script or popup should modify the state
  const tabId = retrieveAnyActionTab(action);

  if (tabId !== undefined) {
    const tabState = state[tabId] || {};
    // On the first action to a tab state, initialize the tab with an empty object.
    // todo -- use some tab initial value instead?
    return {
      ...state,
      [tabId]: tab(tabState, action),
    };
  } else {
    return state;
  }
}
