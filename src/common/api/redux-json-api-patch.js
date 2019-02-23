import { API_WILL_READ, API_READ, API_READ_FAILED } from 'redux-json-api/lib/constants';
import { getPaginationUrl, apiRequest } from 'redux-json-api/lib/utils';
import { createAction } from 'redux-actions';

/*
 * Patch allowing to modify axios settings per readEndpoint dispatch
 * Pasted from redux-json-api
 * All modified lines are marked with comments
 */
const apiWillRead = createAction(API_WILL_READ);
const apiRead = createAction(API_READ);
const apiReadFailed = createAction(API_READ_FAILED);

class ApiResponse {
  constructor(response, dispatch, nextUrl, prevUrl) {
    this.body = response;
    this.dispatch = dispatch;
    this.nextUrl = nextUrl;
    this.prevUrl = prevUrl;
  }

  /* eslint-disable */
  loadNext = () => this.dispatch(readEndpoint(this.nextUrl));

  loadPrev = () => this.dispatch(readEndpoint(this.prevUrl));
  /* eslint-enable */
}

// PP: changed name
export const readEndpointWithCustomOptions = (endpoint, {
  options = {
    indexLinks: undefined,
  },
  requestOptions = {}, // PP additional option
} = {}) => {
  return (dispatch, getState) => {
    dispatch(apiWillRead(endpoint));

    const { axiosConfig } = getState().api.endpoint;

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, { ...axiosConfig, ...requestOptions}) // PP: use the new options
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
