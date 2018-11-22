import { loadSettings } from '../config/pp-settings';
const PPSettings = loadSettings();

export const SCREEN = {
  width: 1280,
  height: 800,
};
export const TIMEOUT = 20000;
export const BROWSER = 'chrome';
export const { API_URL, SITE_URL } = PPSettings;

export const { hostname: API_HOSTNAME, port: API_PORT } = new URL(API_URL);
