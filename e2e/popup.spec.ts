import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';
import { simulateLogIn } from './common';
// noinspection TsLint
const packageConf = require('../package');

const PP_CSS_POPUP_CONTENT_CLASS = 'popup-content';
const PP_CSS_GOOGLE_BUTTON_CLASS = 'google-login-button';
const PP_CSS_FB_BUTTON_CLASS = 'fb-login-button';

describe('popup', () => {
  let browser;

  beforeEach(async () => {
    browser = await buildBrowser();
  });

  test('displays login page when unlogged', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
    await browser.findElement(By.css(`.${PP_CSS_GOOGLE_BUTTON_CLASS}`));
    await browser.findElement(By.css(`.${PP_CSS_FB_BUTTON_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  test('displays content when logged in', async () => {
    await simulateLogIn(browser);
    await browser.get('data:'); // reset
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
    await browser.findElement(By.css(`.${PP_CSS_POPUP_CONTENT_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  afterEach(async () => {
    await browser.quit();
  });
});
