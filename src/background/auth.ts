import store from './store';
import axios from 'axios';
import { refreshAccessToken } from '../common/store/storage/actions';
import { selectStorage } from '../common/store/storage/selectors';
import axiosRetry, { isNetworkError } from 'axios-retry';
import interval from 'interval-promise';

export function refreshToken() {
  const { auth } = selectStorage(store.getState());
  if (!auth) {
    return;
  }
  const data = {
    refresh: auth.refresh,
  };
  const client = axios.create();
  axiosRetry(client, {
    retryDelay: retryCount => retryCount * 1000,
    retries: 10,
    retryCondition: e => true,
  });
  return client({
    method: 'post',
    url: `${PPSettings.API_URL}/auth/refresh/`,
    data: { data },
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  })
    .then((resp) => {
      const { access, refresh } = resp.data.data;
      return store.dispatch(refreshAccessToken({
        access,
        refresh,
      }));
    })
    .catch((err) => {
      // catch it so set interval keeps trying
      // todo sentry or what?
    });
}

export function setRefreshTokenInterval() {
  interval(refreshToken, PPSettings.ACCESS_REFRESH_INTERVAL);
}
