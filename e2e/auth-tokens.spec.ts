// noinspection TsLint
import { waitUntil } from './utils';
// noinspection TsLint
const packageConf = require('../package');
import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';
import { simulateLogIn } from './common';

let refreshTimesCalled;
let refreshStatus;

describe('access token', () => {
  let browser;
  let apiServer;

  const apiApp = express();
  apiApp.post('/api/auth/refresh/', (req, res) => {
    refreshTimesCalled += 1;
    res.status(refreshStatus);
    res.send();
  });

  beforeAll(async () => {
    browser = await buildBrowser();
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  test('calls token refresh on extension start', async () => {
    refreshStatus = 200;
    await simulateLogIn(browser);
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    refreshTimesCalled = 0;
    await browser.navigate().refresh(); // reload the extension
    expect(await waitUntil(() => refreshTimesCalled >= 1)).toBeTruthy();
  }, e2ePPSettings.TIMEOUT);

  test('retries token refresh on extension start if failed with 503', async () => {
    refreshStatus = 503;
    await simulateLogIn(browser);
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    refreshTimesCalled = 0;
    await browser.navigate().refresh(); // reload the extension
    expect(await waitUntil(() => refreshTimesCalled >= 2, 5000)).toBeTruthy();
  }, e2ePPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
    await new Promise(resolve => apiServer.close(resolve));
  });
});
