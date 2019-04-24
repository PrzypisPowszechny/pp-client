/*
 * Content script/popup side selector retrieving the appropriate tab from state
 */
import { getTabId } from './tab-utils';
import { PopupMode } from './tab/popupInfo';

export const selectTab = (state) => baseSelectTab(state, true);

export const trySelectTab = (state) => baseSelectTab(state, false);

export const baseSelectTab = (state, raiseException: boolean) => {
  const realTabId = selectRealTabId(state, raiseException);
  if (realTabId === null) {
    return null;
  }
  let logicalTabId = realTabId;
  const realTab = state.tabs[realTabId];
  if (realTab.popupInfo) {
    const { debugEmulationMode, debugLinkedTabId } = realTab.popupInfo;
    if (debugEmulationMode == PopupMode.autonomousTabLinkedToTab) {
      logicalTabId = debugLinkedTabId;
    }
  }
  return state.tabs[logicalTabId];
};

const selectRealTabId = (state, raiseException: boolean) => {
  const realTabId = getTabId();
  if (realTabId === undefined) {
    if (raiseException) {
      throw new Error('Tab id not set in selectTab selector');
    }
    return null;
  }
  const realTab = state.tabs[realTabId];
  if (!realTab) {
    if (raiseException) {
      throw new Error('Tab state is accessed though not initialized');
    }
    return null;
  }
  if (!realTab.tabInfo) {
    if (raiseException) {
      throw new Error('Tab info state is not initialized');
    }
    return null;
  }
  return realTabId;
}

export const selectRealTab = (state) => state.tabs[selectRealTabId(state, true)];

export const trySelectRealTab = (state) => {
  const realTabId = selectRealTabId(state, false);
  if (realTabId === null) {
    return null;
  }
  return state.tabs[realTabId];
}
