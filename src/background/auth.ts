import store from './store';
import axios from 'axios';
import { accessTokenRefresh } from '../common/store/storage/actions';
import { selectStorage, selectUserForDashboard } from '../common/store/storage/selectors';
import axiosRetry, { isRetryableError } from 'axios-retry';
import interval from 'interval-promise';
import * as Sentry from '@sentry/browser';

// TODO turn into observable; for now it seems complicated...
export function refreshToken() {
  const { auth } = selectStorage(store.getState());
  if (!auth.access) {
    return Promise.resolve(null);
  }
  const data = {
    refresh: auth.refresh,
  };
  const client = axios.create();
  axiosRetry(client, {
    retryDelay: retryCount => retryCount * 2000,
    retries: 5,
    // overwrite default axiosRetry retry condition to "no response or status code in <500, 599>"
    retryCondition: isRetryableError,
  });
  return client({
    method: 'post',
    url: `${PPSettings.API_URL}/auth/refresh/`,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => {
      if (!resp || !resp.data || !resp.data.data) {
        throw new Error(`Error refreshing access token: bad response`);
      }
      const { access, refresh } = resp.data.data;
      return store.dispatch(accessTokenRefresh({
        access,
        refresh,
      }));
    })
    .catch((err) => {
      Sentry.captureException(new Error(`Error refreshing token: ${err.toString()}`));
    });
}

export function refreshTokenRoutine() {
  refreshToken().finally(() =>
    interval(refreshToken, PPSettings.ACCESS_REFRESH_INTERVAL, { stopOnError: false }),
  );
}
