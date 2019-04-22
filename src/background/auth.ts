import store from './store';
import axios from 'axios';
import { accessTokenRefresh } from '../common/store/storage/actions-background';
import { selectStorage } from '../common/store/storage/selectors';
import axiosRetry, { isRetryableError } from 'axios-retry';
import interval from 'interval-promise';
import {
  FacebookCredentials,
  GoogleCredentials,
  PPIntegrationCredentialsAPIModel,
  PPLoginResponseAPIModel,
} from 'common/api/user';
import { AuthProviders } from 'common/store/runtime/types';
import { parseUrlParams } from '../common/url';

type URLString = string;

export async function authenticate(provider: AuthProviders): Promise<PPLoginResponseAPIModel> {
  const authFlowResult: PPIntegrationCredentialsAPIModel = await authenticateProvider(provider);
  // Check if canceled
  if (!authFlowResult) {
    return null;
  }
  return await authenticatePP(provider, authFlowResult);
}

export async function authenticateProvider(provider: AuthProviders): Promise<PPIntegrationCredentialsAPIModel> {
  let authURL;
  switch (provider) {
    case AuthProviders.facebook:
      authURL = buildFbRedirectUrl();
      break;
    case AuthProviders.google:
      authURL = buildGoogleRedirectUrl();
      break;
    default:
      throw Error(`Cannot build authUrl for supplied provider, value: "${provider}"`);
  }

  const authResponseUrl: URLString = await new Promise<URLString>(
    resolve => chrome.identity.launchWebAuthFlow({ interactive: true, url: authURL }, resolve),
  );

  let authParams;
  // Leaving auth window by closing it triggers chrome exception, so we can't treat chrome errors seriously
  if (chrome.runtime.lastError || !authResponseUrl) {
    return null;
  }
  authParams = parsePostAuthenticateRedirectURL(authResponseUrl);
  return {
    // fb uses camelcase while google underscores
    accessToken: authParams.accessToken || authParams.access_token,
    expiresIn: authParams.expiresIn || authParams.expires_in,
    tokenType: authParams.tokenType || authParams.token_type,
  };
}

export async function authenticatePP(
  provider: AuthProviders, data: PPIntegrationCredentialsAPIModel,
): Promise<PPLoginResponseAPIModel> {
  const httpResponse = await axios({
    method: 'post',
    url: `${PPSettings.API_URL}/auth/${provider}/`,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return httpResponse.data;
}

function buildFbRedirectUrl() {
  const redirectURL = chrome.identity.getRedirectURL();
  const appID = '2290339024350798';
  const scopes = ['email', 'public_profile'];
  let authURL = 'https://www.facebook.com/v2.9/dialog/oauth';
  authURL += `?client_id=${appID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return authURL;
}

function buildGoogleRedirectUrl() {
  const redirectURL = chrome.identity.getRedirectURL();
  const clientID = '823340157121-mplb4uvgu5ena8fuuuvvnpn773hpjim4.apps.googleusercontent.com';
  const scopes = ['email', 'profile'];
  let authURL = 'https://accounts.google.com/o/oauth2/auth';
  authURL += `?client_id=${clientID}`;
  authURL += `&response_type=token`;
  authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
  authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

  return authURL;
}

function parsePostAuthenticateRedirectURL(redirectUrl): GoogleCredentials | FacebookCredentials {
  // This is not real queryString, in OAuth is is queryString passed in hash fragment
  const queryString = redirectUrl.substr(redirectUrl.indexOf('#') + 1);
  return parseUrlParams(queryString) as any;
}

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
      if (!resp || !resp.data) {
        throw new Error(`Error refreshing access token: bad response`);
      }
      const { access, refresh } = resp.data;
      return store.dispatch<any>(accessTokenRefresh({
        access,
        refresh,
      }));
    })
    .catch((err) => {
      throw new Error(`Error refreshing token: ${err.toString()}`);
    });
}

export function refreshTokenRoutine() {
  refreshToken().finally(() =>
    interval(refreshToken, PPSettings.ACCESS_REFRESH_INTERVAL, { stopOnError: false }),
  );
}
