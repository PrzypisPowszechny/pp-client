import { loadSettings } from '../../config/pp-settings';
const PPSettings = loadSettings();

export const SCREEN = {
  width: 1280,
  height: 800,
};
export const TIMEOUT = 100000;
export const BROWSER = 'chrome';
export const { API_URL, SITE_URL } = PPSettings;

export const { hostname: API_HOSTNAME, port: API_PORT } = new URL(API_URL);
if (API_HOSTNAME !== 'localhost' && API_HOSTNAME  !== '127.0.0.1') {
  throw Error('Only localhost is accepted as API host for the e2e tests. Did you set PP_API env var?');
}
if (!API_PORT) {
  throw Error(`API url should specify port value, got ${PPSettings.API_URL} `);
}
