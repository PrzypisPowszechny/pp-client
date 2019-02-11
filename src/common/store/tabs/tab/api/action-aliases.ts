import {
  createResource as originalcreateResource,
  readEndpoint as originalReadEndpoint,
  updateResource as originalUpdateResource,
  deleteResource as originalDeleteResource,
  requireResource as originalRequireResource,
} from 'redux-json-api';
import { aliasActionToTabMarkedThunk } from 'common/store/action-utils';

export const reduxJsonApiAliases = {
  createResource: aliasActionToTabMarkedThunk(originalcreateResource),
  readEndpoint: aliasActionToTabMarkedThunk(originalReadEndpoint),
  updateResource: aliasActionToTabMarkedThunk(originalUpdateResource),
  deleteResource: aliasActionToTabMarkedThunk(originalDeleteResource),
  requireResource: aliasActionToTabMarkedThunk(originalRequireResource),
};
