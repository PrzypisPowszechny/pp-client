const packageConf = require('../package');
import { By } from 'selenium-webdriver';
import { buildBrowser } from './setup/browser';
import * as e2ePPSettings from './setup/settings';

describe('background page runs', () => {
  let browser;

  beforeAll(async () => {
    browser = await buildBrowser();
  });

  test('loads background page', async () => {
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/_generated_background_page.html`);
    await browser.findElement(By.tagName('script'));
  }, e2ePPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
  });
});
