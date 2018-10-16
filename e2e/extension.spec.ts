const packageConf = require('../package');
import { loadSettings } from '../config/pp-settings';
import express from 'express';
import { Builder, By, Key, ActionSequence, Button } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';

// TODO: this is just first, basic implementation of our e2e tests. Split this file to utils and tools as it grows.

const screen = {
  width: 1280,
  height: 800,
};
const TIMEOUT = 10000;
const BROWSER = 'chrome';
const PPSettings = loadSettings();

const ADD_ANNOTATION_ACTION = 'EMULATE_ON_CONTEXT_MENU_ANNOTATE';
const PP_CSS_SCOPE_CLASS = 'pp-ui';
const PP_CSS_EDITOR_CLASS_PREFIX = 'Editor__self';


jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;

describe('extension runs normally', () => {
  let browser;
  let initPingsCount = 0;
  let apiServer;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });
  apiApp.post('/site/pings/init/', (req, res) => {
    initPingsCount++;
    res.send('Success!');
  });

  beforeAll( async () => {
    await new Promise( (resolve, reject) => {
      apiServer = apiApp.listen(new URL(PPSettings.API_URL).port, resolve);
    });

    browser = new Builder().forBrowser(BROWSER)
    // In chrome extension are disabled when running headless
    .setChromeOptions(new chrome.Options().addArguments('load-extension=./dist/browser-extension'))
    // Firefox not used currently
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();

    await browser.manage().setTimeouts({
      implicit: TIMEOUT,
      pageLoad: TIMEOUT,
      script: TIMEOUT,
    });
  });

  test('calls init ping', async () => {
    // Load any page, by that time ping should have been made
    await browser.get('data:');
    expect(initPingsCount).toEqual(1);
  }, TIMEOUT);

  test('loads background page', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    await browser.findElement(By.tagName('script'));
  }, TIMEOUT);

  test('opens editor', async () => {
    await browser.get(`${PPSettings.SITE_URL}/some-text/`);
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
  }, TIMEOUT);

  afterAll(async () => {
    await browser.quit();
    apiServer.close(() => null );
  });
});
