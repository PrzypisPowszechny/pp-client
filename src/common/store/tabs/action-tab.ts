/*
 * This module identifies where the redux action was originally issued (content script / poopup / background)
 */

import { getScriptType, ScriptType } from 'common/meta/script-type';
import { getCurrentActiveTabId } from '../../../background/tab';

/*
 * Retrieve tab id for an primary action (transported from a different browser extension part or not)
 */
export function retrievePrimaryActionTab(action) {
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
  // Does it come from popup?
  if (sender.tab === undefined) {
    // popup is always related to the currently active tab (it disappears when it loses focus)
    // so the tab id can be correctly associated with the id of the currently active tab
    // Hopefully activeTab permission always allows to retrieve it: https://developer.chrome.com/extensions/activeTab
    return getCurrentActiveTabId();
  }

  // It must be from content script
  const tabId = sender.tab.id;
  if (tabId === undefined) {
    throw new Error('Could not retrieve the tab id for a content script action');
  }
  return tabId;
}

/*
 * Retrieve tab id for any of:
 * - primary action (transported from a different browser extension part or not)
 * - an action dispatched within a thunk action, additionally marked
 */
export function retrieveActionTab(action) {
  if (getScriptType() !== ScriptType.background) {
    throw new Error('This util can only be called within background page');
  }

  // Is it an action dispatched within a thunk action, marked manually? (from either popup or content script)
  if (action._meta && action._meta.tabId) {
    return action._meta.tabId;
  }

  return retrievePrimaryActionTab(action);
}

export function markInThunkActionWithTabId(action, tabId) {
  return {
    ...action,
    _meta: { tabId },
  };
}
