/*
 * Content script/popup side selector retrieving the appropriate tab from state
 */
import { getTabId } from 'common/tab-id';

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

export const selectIsTabInitialized = (state) => {
  const tabId = getTabId();
  return Boolean(tabId !== undefined && state.tabs && state.tabs[tabId]);
}
