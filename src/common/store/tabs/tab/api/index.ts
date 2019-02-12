import { TAB_INIT } from '../../actions';
import { reducer as api } from 'redux-json-api';

// Because redux-json-api is not prepared to safely execute all actions
// unless given type has already been loaded into the store with readEndpoint,
// we initialize all types manually to be able to call eg. deleteResource right away.
export const apiInitializedFields = {
  annotations: { data: [] },
  annotationUpvotes: { data: [] },
};

export default function initializedApi(state = {}, action) {
  if (action.type === TAB_INIT) {
    return {
      ...apiInitializedFields,
      // reducer call mirroring store initialisation with combineReducers
      ...api(undefined, {}),
      // do not clear the API state, if it has been populated with models already
      // (this action can be called by content script/popup in any order)
      ...state,
    };
  } else {
    return api(state, action);
  }
}
