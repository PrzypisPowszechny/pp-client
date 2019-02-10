import { TAB_INIT } from '../actions';
import { reducer as api } from 'redux-json-api';

// Because redux-json-api is not prepared to safely execute all actions
// unless given type has already been loaded into the store with readEndpoint,
// we initialize all types manually to be able to call eg. deleteResource right away.
export const apiInitializedFields = {
  annotations: { data: [] },
  annotationUpvotes: { data: [] },
};

export function initializedApi(state = {}, action) {
  console.log('initialized API');
  if (action.type === TAB_INIT) {
    return {
      ...apiInitializedFields,
      // reducer call mirroring store initialisation with combineReducers
      ...api(undefined, {}),
    };
  } else {
    return api(state, action);
  }
}

// tslint:disable:max-line-length
/*
 * Alias actions to transmit the action to the background page -- a side effect of react-chrome-redux
 * https://github.com/tshaddix/react-chrome-redux#4-optional-implement-actions-whose-logic-only-happens-in-the-background-script-we-call-them-aliases
 */

// tslint:enable:max-line-length

export function createResource(...args) {
  return { type: 'createResource', args };
}

export function readEndpoint(...args) {
  return { type: 'readEndpoint', args };
}

export function updateResource(...args) {
  return { type: 'updateResource', args };
}

export function deleteResource(...args) {
  return { type: 'deleteResource', args };
}

export function requireResource(...args) {
  return { type: 'requireResource', args };
}
