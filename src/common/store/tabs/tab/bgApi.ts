import {
  createResource as originalcreateResource,
  readEndpoint as originalReadEndpoint,
  updateResource as originalUpdateResource,
  deleteResource as originalDeleteResource,
  requireResource as originalRequireResource,
} from 'redux-json-api';
import { bgSelectTab } from '../../bgSelectors';

// TODO use selector instead
// TODO pass _sender to actions called inside thunk in a better way

function reduxJsonThunkToPostAliasThunk(originalThunk) {
  return (originalAction) => {
    return (dispatch, getState) => {
      const newGetState = () => {
        return getState().tabs[originalAction._sender.tab.id];
      };
      // attach the sender to all actions dispatched within the thunk
      const newDispatch = action => dispatch({ ...action, _sender: originalAction._sender });
      return originalThunk(...originalAction.args)(newDispatch, newGetState);
    };
  };
}

// very
export const reduxJsonApiAliases = {
  createResource: reduxJsonThunkToPostAliasThunk(originalcreateResource),
  readEndpoint: reduxJsonThunkToPostAliasThunk(originalReadEndpoint),
  updateResource: reduxJsonThunkToPostAliasThunk(originalUpdateResource),
  deleteResource: reduxJsonThunkToPostAliasThunk(originalDeleteResource),
  requireResource: reduxJsonThunkToPostAliasThunk(originalRequireResource),
};
