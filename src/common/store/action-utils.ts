import { markActionWithTabId, retrieveActionTab } from './tabs/action-tab';

/*
 * The primary actions (ordinary objects {} ) are marked by webext-redux with _sender.
 * In the reducers (living in background page) this allows to establish the tab in which the action
 * was originally dispatched.
 * Thunk actions, however, are functions that dispatch more actions within their body.
 * These must carry information about the origin tab, too, although this is not done automatically by webext-redux.
 *
 * This function converts a thunk into a tab-marked thunk by additionally decorating thunk (state, dispatch) arguments.
 * Actions dispatched within a thunk action are now marked with tab information, too.
 *
 * "aliasOrdinaryAction" stands for the serializable action alias sent within browser message,
 * mapped to a thunk on background page side.
 */
export function aliasActionToTabMarkedThunk(originalThunkAction) {
  return (aliasOrdinaryAction) => {
    return (dispatch, getState) => {
      const tabId = retrieveActionTab(aliasOrdinaryAction);
      // attach the sender to all actions dispatched within the thunk
      const newDispatch = action => dispatch(markActionWithTabId(action, tabId));
      return originalThunkAction(...aliasOrdinaryAction.args)(newDispatch, getState);
    };
  };
}
