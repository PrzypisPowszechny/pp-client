import { markInThunkActionWithTabId, retrieveActionTab } from './tabs/action-tab';

/*
 * The primary actions (ordinary objects {} ) are marked by webext-redux with _sender.
 * This allows to establish the tab for which the action was issued in the reducer
 * Thunk actions, however, are functions issuing more functions within their body.
 * These must carry the tab information, too.
 *
 * This function converts a thunk into a tab-marked thunk by additionally decorating thunk (state, dispatch) arguments.
 *
 * "aliasAction" stands for the serializable action alias sent within browser message,
 * mapped to a thunk on background page side.
 */
export function aliasActionToTabMarkedThunk(originalThunk) {
  return (aliasAction) => {
    return (dispatch, getState) => {
      const tabId = retrieveActionTab(aliasAction);
      // attach the sender to all actions dispatched within the thunk
      const newDispatch = action => dispatch(markInThunkActionWithTabId(action, tabId));
      return originalThunk(...aliasAction.args)(newDispatch, getState);
    };
  };
}


