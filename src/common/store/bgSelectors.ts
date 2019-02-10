import { getCurrentTabId } from '../../background/tab';

export const bgSelectTab = (state) => {
  const tabId = getCurrentTabId();
  if (tabId === undefined) {
    throw new Error('Tab id not set in selectTab selector');
  }
  const tab = state.tabs[tabId];
  if (!tab) {
    throw new Error('Tab state is accessed though not initialized');
  }
  return tab;
}
