import {
  createResource as originalcreateResource,
  readEndpoint as originalReadEndpoint,
  updateResource as originalUpdateResource,
  deleteResource as originalDeleteResource,
  requireResource as originalRequireResource,
} from 'redux-json-api';
import { markActionWithTabId, retrieveRealActionTab } from '../../action-tab';
import {
  readEndpointWithCustomOptions as originalReadEndpointWithCustomOptions,
} from 'common/api/redux-json-api-patch';

// A redux-json-api version of common/action-utils converter
// Amend getState to return current tab state (since redux-json-api assumes its state is preserved in the root)
export function reduxJsonApiAliasActionToTabMarkedThunk(originalThunk) {
  return (aliasAction) => {
    return (dispatch, getState) => {
      const tabId = retrieveRealActionTab(aliasAction);
      // attach the tabId to all actions dispatched within the thunk
      const newDispatch = action => dispatch(markActionWithTabId(action, tabId));
      const newGetState = () => getState().tabs[tabId];
      return originalThunk(...aliasAction.args)(newDispatch, newGetState);
    };
  };
}

export const reduxJsonApiAliases = {
  createResource: reduxJsonApiAliasActionToTabMarkedThunk(originalcreateResource),
  readEndpoint: reduxJsonApiAliasActionToTabMarkedThunk(originalReadEndpoint),
  readEndpointWithCustomOptions: reduxJsonApiAliasActionToTabMarkedThunk(originalReadEndpointWithCustomOptions),
  updateResource: reduxJsonApiAliasActionToTabMarkedThunk(originalUpdateResource),
  deleteResource: reduxJsonApiAliasActionToTabMarkedThunk(originalDeleteResource),
  requireResource: reduxJsonApiAliasActionToTabMarkedThunk(originalRequireResource),
};
