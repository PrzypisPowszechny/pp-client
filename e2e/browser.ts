import { Builder, By, Key, ActionSequence, Button, IWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import * as e2ePPSettings from './settings';

export async function buildBrowser(): IWebDriver {
  const browser = new Builder().forBrowser(e2ePPSettings.BROWSER)
  // In chrome extension are disabled when running headless
  .setChromeOptions(new chrome.Options().addArguments('load-extension=./dist/browser-extension'))
  // Firefox not used currently
  .setFirefoxOptions(new firefox.Options().headless().windowSize(e2ePPSettings.SCREEN))
  .build();

  await browser.manage().setTimeouts({
    implicit: e2ePPSettings.TIMEOUT,
    pageLoad: e2ePPSettings.TIMEOUT,
    script: e2ePPSettings.TIMEOUT,
  });

  jasmine.DEFAULT_TIMEOUT_INTERVAL = e2ePPSettings.TIMEOUT;

  return browser;
}
