import store from './store/store';
import axios from 'axios';
import { setAxiosConfig } from 'redux-json-api';
import { getExtensionCookie } from './messages';

export function configureAPIRequests() {
  /*
   * Crucial configuration:
   * 1. Add PP-SITE-URL header (used to protect browsing history as opposed to ordinary GET parameters)
   * consumed by API in annotation list endpoint
   * 2. ADD CSRF token header for all state-changing requests
   */
  axios.interceptors.request.use((config) => {
    config.headers['PP-SITE-URL'] = window.location.href;

    if (['options', 'get', 'head'].indexOf(config.method) === -1) {
      return getExtensionCookie('csrftoken').then((csrfToken) => {
        if (!csrfToken) {
          return Promise.reject(`CSRF token is not available when initiating a ${config.method} request!`);
        }
        config.headers['X-CSRFToken'] = csrfToken;
        return Promise.resolve(config);
      });
    }
    return config;
  });

  // settings for redux-json-api
  store.dispatch(setAxiosConfig({
    baseURL: PPSettings.API_URL,
    withCredentials: true,
  }));
}
