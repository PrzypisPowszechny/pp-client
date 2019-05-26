// noinspection TsLint
import { simulateLogIn } from './shared/routines';
import { Builder, By, Key, ActionSequence, Button } from 'selenium-webdriver';

const packageConf = require('../package');
import { buildBrowser } from './setup/browser';

import express from 'express';
import http from 'http';
import * as e2ePPSettings from './setup/settings';
import { newTab, sleep, switchToTab } from './utils';


const PP_FB_BUTTON_CLASS = 'fb-login-button';
const PP_GOOGLE_BUTTON_CLASS = 'google-login-button';
const PP_POPUP_CONTENT_CLASS = 'popup-content';
const PP_POPUP_NO_MATCH_CLASS = 'popup-no-tab-match';



// todo: find a cleaner way to delete all tabs but the first one then restart the browser
describe('checks additional e2e setup necessary for other tests', () => {
  let browser;
  let apiServer;
  const apiApp = express();

  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });

  beforeAll(async () => {
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  beforeEach(async () => {
    browser = await buildBrowser();
  });

  test('popup loads correctly as an autonomous tab when unlogged', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
    await browser.findElement(By.css(`.${PP_FB_BUTTON_CLASS}`));
    await browser.findElement(By.css(`.${PP_GOOGLE_BUTTON_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  test('popup loads correctly as an autonomous tab', async () => {
    await simulateLogIn(browser);
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
    await browser.findElement(By.css(`.${PP_POPUP_CONTENT_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  test('popup loads correctly as an autonomous tab linked to a tab when unlogged', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    await newTab(browser);
    await switchToTab(browser, 1);
    // non-existing tab parameter
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html?devTabId=1234`);
    await browser.findElement(By.css(`.${PP_POPUP_NO_MATCH_CLASS}`));
    // correct tab id
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html?devTabId=2`);
    await browser.findElement(By.css(`.${PP_POPUP_CONTENT_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  test('popup loads correctly as an autonomous tab linked to a tab', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    await newTab(browser);
    await switchToTab(browser, 1);
    // non-existing tab parameter
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html?devTabId=1234`);
    await browser.findElement(By.css(`.${PP_POPUP_NO_MATCH_CLASS}`));
    // correct tab id
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html?devTabId=2`);
    await browser.findElement(By.css(`.${PP_POPUP_CONTENT_CLASS}`))
  }, e2ePPSettings.TIMEOUT);

  afterEach(async () => {
    await browser.quit();
  });

  afterAll(async () => {
    await new Promise(resolve => apiServer.close(resolve));
  });
});
