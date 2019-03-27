import axios from 'axios';

export function configureAxios(
  getAccessToken: () => string,
) {
  /*
   * Crucial configuration needed for (almost) all API requests
   * -- common for content scripts, popup and background part of the extension
   *
   * add access token to all requests
   */
  axios.interceptors.request.use((config) => {
    const access = getAccessToken();
    if (access) {
      config.headers['Authorization'] = `JWT ${access}`;
    }
    return config;
  });
}
