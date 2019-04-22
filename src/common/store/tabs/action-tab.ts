/*
 * This module identifies where the redux action was originally issued (content script / poopup / background)
 */

import { getScriptType, ScriptType } from 'common/meta/script-type';
import { getActiveTabId } from '../../../background/tab';
import store from '../../../background/store/store';
import { DEBUG_TAB_POPUP_INIT, DEBUG_TAB_POPUP_IS_VALID } from './actions';

/*
 * Retrieve tab id for an primary action (transported from a different browser extension part or not)
 */
export function retrieveRealPrimaryActionTab(action) {
  if (getScriptType() !== ScriptType.background) {
    throw new Error('This util can only be called within background page');
  }

  // Is it a "remote" action (transported from a different browser extension part)?
  const sender = action._sender;
  if (!sender) {
    // It is an action dispatched within the same script that it is now being processed -- background page
    // TODO validate that the sender isn't incorrectly missing
    return null;
  }
  // Does it come from popup (opened with extension mouse click)?
  if (sender.tab === undefined) {
    // popup is always related to the currently active tab (it disappears when it loses focus)
    // so the tab id can be correctly associated with the id of the currently active tab
    // Hopefully activeTab permission always allows to retrieve it: https://developer.chrome.com/extensions/activeTab
    return getActiveTabId();
  }

  // The action must come from a real, separate tab
  const tabId = sender.tab.id;
  if (tabId === undefined) {
    throw new Error('Could not retrieve the id for an action');
  }
  return tabId;
}

/*
 * Retrieve tab id for any of:
 * - primary action (transported from a different browser extension part or not)
 * - an action dispatched within a thunk action, additionally marked
 */
export function retrieveRealActionTab(action) {
  if (getScriptType() !== ScriptType.background) {
    throw new Error('This util can only be called within background page');
  }

  // Is it an action dispatched within a thunk action, marked manually? (from either popup or content script)
  if (action._meta && action._meta.tabId) {
    return action._meta.tabId;
  }

  return retrieveRealPrimaryActionTab(action);
}

export function retrieveLogicalActionTab(action, tabs) {
  const realTabId = retrieveRealActionTab(action);
  // Check an emulated popup mode (popup is opened in a standalone tab)
  if (PPSettings.DEV) {
    const tabId = checkForEmulatedPopupTabId(realTabId, action.type, tabs);
    if (tabId) {
      return tabId;
    }
  }
  return realTabId;
}

export function checkForEmulatedPopupTabId(realTabId, actionType, tabs) {
  if (actionType === DEBUG_TAB_POPUP_INIT || actionType === DEBUG_TAB_POPUP_IS_VALID) {
    // These are the only actions that apply to the real tab (and the logical tab, for which the popup is emulated)
    return realTabId;
  }

  const tab = tabs[realTabId];
  if (tab && tab.tabInfo && tab.tabInfo.debugIsTabPopupEmulated) {
    return tab.tabInfo.tabId;
  }
  return null;
}

export function markActionWithTabId(action, tabId) {
  return {
    ...action,
    _meta: { tabId },
  };
}

export function syncTabMark(action1, action2) {
  const tabId = retrieveRealActionTab(action1);
  return markActionWithTabId(action2, tabId);
}
