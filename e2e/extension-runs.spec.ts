// noinspection TsLint
import { dispatchDOMEvent } from './utils';
// noinspection TsLint
const packageConf = require('../package');
import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';
import { simulateLogIn } from './common';
import { EMULATE_ON_CONTEXT_MENU_ANNOTATE } from './events';

const PP_CSS_SCOPE_CLASS = 'pp-ui';
const PP_CSS_EDITOR_CLASS_PREFIX = 'Editor__self';

describe('extension runs normally', () => {
  let browser;
  let apiServer;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });

  beforeAll(async () => {
    browser = await buildBrowser();
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  test('loads background page', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    await browser.findElement(By.tagName('script'));
  }, e2ePPSettings.TIMEOUT);

  test('opens editor', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    const someText = await browser.findElement(By.tagName('p'));
    await browser.actions().doubleClick(someText).perform();
    // Use special hook to emmit and open editor on this event as context menu click is out of selenium's control...
    await dispatchDOMEvent(browser, EMULATE_ON_CONTEXT_MENU_ANNOTATE);
    await browser.findElement(By.css(`.${PP_CSS_SCOPE_CLASS}[class*="${PP_CSS_EDITOR_CLASS_PREFIX}"]`));

    // Example of selecting all
    // await browser.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).perform();
  }, e2ePPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
    await new Promise(resolve => apiServer.close(resolve));
  });
});
