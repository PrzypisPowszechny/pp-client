import { waitUntil } from './utils';
// noinspection TsLint
const packageConf = require('../package');
import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';

const ADD_ANNOTATION_ACTION = 'EMULATE_ON_CONTEXT_MENU_ANNOTATE';
const PP_CSS_SCOPE_CLASS = 'pp-ui';
const PP_CSS_EDITOR_CLASS_PREFIX = 'Editor__self';

describe('extension runs normally', () => {
  let browser;
  let apiServer;
  let initPingsCount = 0;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });
  apiApp.post('/site/pings/init/', (req, res) => {
    initPingsCount++;
    res.send('Success!');
  });

  beforeAll( async () => {
    browser = await buildBrowser();
    await new Promise( res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  test('calls init ping', async () => {
    await browser.get('data:');
    await waitUntil( () => initPingsCount > 0);
    expect(initPingsCount).toEqual(1);
  }, e2ePPSettings.TIMEOUT);

  test('loads background page', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    await browser.findElement(By.tagName('script'));
  }, e2ePPSettings.TIMEOUT);

  test('opens editor', async () => {
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    const someText = await browser.findElement(By.tagName('p'));
    await browser.actions().doubleClick(someText).perform();
    // Use special hook to emmit and open editor on this event as context menu click is out of selenium's control...
    await browser.executeScript(`
      var event = document.createEvent('Event');
      event.initEvent('${ADD_ANNOTATION_ACTION}');
      document.dispatchEvent(event);
    `);
    await browser.findElement(By.css(`.${PP_CSS_SCOPE_CLASS}[class*="${PP_CSS_EDITOR_CLASS_PREFIX}"]`));

    // Example of selecting all
    // await browser.actions().keyDown(Key.CONTROL).sendKeys('a').keyUp(Key.CONTROL).perform();
  }, e2ePPSettings.TIMEOUT);

  afterAll( async () => {
    await browser.quit();
    await new Promise( resolve => apiServer.close(resolve));
  });
});
