import { createAction } from 'redux-actions';

import {
  API_WILL_READ, API_READ, API_READ_FAILED,
  readEndpoint,
} from 'redux-json-api';

const apiWillRead = createAction('API_WILL_READ');
const apiRead = createAction('API_READ');
const apiReadFailed = createAction('API_READ_FAILED');

/*
 * The whole excerpt is readEndpointCustom
 * A copy of
 * https://github.com/redux-json-api/redux-json-api/blob/9e4210af054e3ccdc61c312480de09ba844760fd/src/jsonapi.js#L85
 * as of "redux-json-api": "^2.0.0-beta.5"
 * A version adapted to pass settings per request
 */

import axios from 'axios';
import createError from 'axios/lib/core/createError';


/*
 * redux-json-api/utils (not exported, so we pasted it here)
 * It involves just a minor modification in getPaginationUrl (noted in a comment)
 */
const jsonContentTypes = [
  'application/json',
  'application/vnd.api+json'
];

const hasValidContentType = response => jsonContentTypes.some(
  contentType => response.headers['content-type'].indexOf(contentType) > -1
);

export const hasOwnProperties = (obj, propertyTree) => {
  if ((obj instanceof Object) === false) {
    return false;
  }
  const property = propertyTree[0];
  const hasProperty = obj.hasOwnProperty(property);
  if (hasProperty) {
    if (propertyTree.length === 1) {
      return hasProperty;
    }
    return hasOwnProperties(obj[property], propertyTree.slice(1));
  }
  return false;
};

const getPaginationUrl = (response, direction, path) => {
  if (!response.links || !hasOwnProperties(response, ['links', direction])) {
    return null;
  }
  return response.links[direction]
    .replace(`${path}/`, '');
};

const apiRequest = (url, options = {}) => {
  // A modified part: the options have more priority over the defaults such as headers
  const allOptions = {
    url,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    ...options,
  };

  return axios(allOptions)
    .then(res => {
      if (res.status === 204) {
        return res;
      }

      if (hasValidContentType(res) === false) {
        throw createError(
          'Invalid Content-Type in response',
          res.config,
          null,
          res
        );
      }

      return res.data;
    });
};

/*
 * Adapted from redux-json-api/jsonapi
 * all modifications are marked
 */

class ApiResponse {
  constructor(response, dispatch, nextUrl, prevUrl) {
    this.body = response;
    this.dispatch = dispatch;
    this.nextUrl = nextUrl;
    this.prevUrl = prevUrl;

    // A temporary modification: originally declared within the body
    this.loadNext = function() { return this.dispatch(readEndpoint(this.nextUrl)) };

    this.loadPrev = function() { this.dispatch(readEndpoint(this.prevUrl)) };
  }
}

// Tweaks have been made in the function below
const readEndpointCustom = (endpoint, {
  options = {
    indexLinks: undefined,
  },
  customSettings = {},
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillRead(endpoint));

    // Modification: custom settings can override the global axios config
    const axiosConfig = {
      ...getState().api.endpoint.axiosConfig,
      ...customSettings,
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, axiosConfig)
        .then(json => {
          dispatch(apiRead({ endpoint, options, ...json }));

          const nextUrl = getPaginationUrl(json, 'next', axiosConfig.baseURL);
          const prevUrl = getPaginationUrl(json, 'prev', axiosConfig.baseURL);

          resolve(new ApiResponse(json, dispatch, nextUrl, prevUrl));
        })
        .catch(error => {
          const err = error;
          err.endpoint = endpoint;

          dispatch(apiReadFailed(err));
          reject(err);
        });
    });
  };
};

export default readEndpointCustom;
