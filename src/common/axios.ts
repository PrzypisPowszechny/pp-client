import axios from 'axios';
import { getExtensionCookie } from './messages';

export function configureAxios(getUrl: () => Promise<string>) {
  /*
   * Crucial configuration:
   * 1. Add PP-SITE-URL header (used to protect browsing history as opposed to ordinary GET parameters)
   * consumed by API in annotation list endpoint
   * 2. ADD CSRF token header for all state-changing requests
   */
  axios.interceptors.request.use((config) => {
    return getUrl().then((url) => {

      config.headers['PP-SITE-URL'] = url;

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
  });
}
