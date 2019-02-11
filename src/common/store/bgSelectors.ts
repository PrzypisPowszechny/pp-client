import { getCurrentActiveTabId } from '../../background/tab';

export const bgSelectTab = (state) => {
  const tabId = getCurrentActiveTabId();
  if (tabId === undefined) {
    throw new Error('Tab id not set in selectTab selector');
  }
  const tab = state.tabs[tabId];
  if (!tab) {
    throw new Error('Tab state is accessed though not initialized');
  }
  return tab;
}
