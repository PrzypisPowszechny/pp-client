import store from './store/store';
import { setAxiosConfig } from 'redux-json-api';
import { getExtensionCookie } from 'common/messages';
import { configureAxios } from 'common/axios';

export function configureAPIRequests() {
  configureAxios(getExtensionCookie);

  // settings for redux-json-api
  store.dispatch(setAxiosConfig({
    baseURL: PPSettings.API_URL,
    withCredentials: true,
  }));
}
