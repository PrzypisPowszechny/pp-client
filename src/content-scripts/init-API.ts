import store from './store';
import { setAxiosConfig } from 'redux-json-api';
import { configureAxios } from 'common/axios';
import { selectAccessToken, selectStorage } from '../common/store/storage/selectors';

export function configureAPIRequests() {
  configureAxios(
    () => selectAccessToken(store.getState()),
  );

  // settings for redux-json-api
  store.dispatch(setAxiosConfig({
    baseURL: PPSettings.API_URL,
    withCredentials: true,
  }));
}
