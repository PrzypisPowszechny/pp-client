import { TAB_INIT } from '../../actions';
import { reducer as api } from 'redux-json-api';

// Because redux-json-api is not prepared to safely execute all actions
// unless given type has already been loaded into the store with readEndpoint,
// we initialize all types manually to be able to call eg. deleteResource right away.
export const apiInitializedFields = {
  annotations: { data: [] },
  annotationUpvotes: { data: [] },
};

const initialState = {
  ...apiInitializedFields,
  // reducer call mirroring store initialisation with combineReducers
  ...api(undefined, {}),
}

export default function initializedApi(state = initialState, action) {
  return api(state, action);
}
