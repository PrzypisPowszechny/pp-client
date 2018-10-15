import store from './store/store';
import axios from 'axios';
import { setAxiosConfig } from 'redux-json-api';

function getExtensionCookie(name: string) {
  // Read special per-extension cookie
  // available not for the host domain (unlike traditional website cookies) but for this particular extension client
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'GET_COOKIE', name }, (response) => {
      if (response) {
        resolve(response.value);
      } else {
        resolve(null);
      }
    });
  });
}

export function configureAPIRequests() {
  /*
   * Crucial configuration:
   * 1. Add PP-SITE-URL header (used to protect browsing history as opposed to ordinary GET parameters)
   * consumed by API in annotation list endpoint
   * 2. ADD CSRF token header for all state-changing requests
   */
  axios.interceptors.request.use((config) => {
    config.headers['PP-SITE-URL'] = window.location.href;

    if (['POST', 'PATCH', 'PUT'].indexOf(config.method) >= 0) {
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
    baseURL: PP_SETTINGS.API_URL,
    withCredentials: true,
  }));
}
