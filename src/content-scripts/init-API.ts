import store from './store/store';
import axios from 'axios';
import { setAxiosConfig } from 'redux-json-api';

export function configureAPIRequests() {

  // add header consumed by '/annotations' endpoint for URL filtering
  axios.interceptors.request.use((config) => {
    config.headers['PP-SITE-URL'] = window.location.href;
    return config;
  });

  // settings for redux-json-api
  store.dispatch(setAxiosConfig({
    baseURL: PP_SETTINGS.API_URL,
    withCredentials: true,
  }));

}
