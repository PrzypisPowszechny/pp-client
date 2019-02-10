import tab from './tab/reducer';
import { getCurrentTabId } from '../../../background/tab';

export default function tabs(state = {}, action) {
  console.log(action);
  // Make sure to modify the state only for actions coming from content script or popup
  if (action._sender !== undefined) {
    let tabId;
    if (action._sender.tab) {
      // content script
      tabId = action._sender.tab.id;
    } else {
      // Popup always modifies the state for current tab (since it disappears on tab change)
      tabId = getCurrentTabId();
      if (tabId === undefined) {
        throw Error('current tabId not initialized in tabs reducer');
      }
    }

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
