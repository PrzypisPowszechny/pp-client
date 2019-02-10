/*
 * Content script/popup side selector retrieving the appropriate tab from state
 */
import { getTabId } from '../tab-init';

export const selectTab = (state) => {
  const tabId = getTabId();
  if (tabId === undefined) {
    throw new Error('Tab id not set in selectTab selector');
  }
  const tab = state.tabs[tabId];
  if (!tab) {
    throw new Error('Tab state is accessed though not initialized');
  }
  return tab;
}
