import axios from 'axios';

export function configureAxios(
  getExtensionCookie: (key: string) => Promise<string>,
) {
  /*
   * Crucial configuration needed for (almost) all API requests
   * -- common for content scripts, popup and background part of the extension
   *
   * ADD CSRF token header for all state-changing requests
   */
  axios.interceptors.request.use((config) => {
    return new Promise((resolve, reject) => {
      if (['options', 'get', 'head'].indexOf(config.method) === -1) {
        return getExtensionCookie('csrftoken').then((csrfToken) => {
          if (!csrfToken) {
            reject(`CSRF token is not available when initiating a ${config.method} request!`);
          }
          config.headers['X-CSRFToken'] = csrfToken;
          resolve(config);
        });
      }
      resolve(config);
    });
  });
}
