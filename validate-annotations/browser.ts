import { Builder, By, Key, ActionSequence, Button } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import * as settings from './settings';

export async function buildBrowser() {
  const browser = new Builder().forBrowser(settings.BROWSER)
  // In chrome extension are disabled when running headless
  .setChromeOptions(new chrome.Options().addArguments('load-extension=./dist/browser-extension'))
  // Firefox not used currently
  .setFirefoxOptions(new firefox.Options().headless().windowSize(settings.SCREEN))
  .build();

  await browser.manage().setTimeouts({
    implicit: 5000,
    pageLoad: 8000,
    script: 10000,
  });

  jasmine.DEFAULT_TIMEOUT_INTERVAL = settings.TIMEOUT;

  return browser;
}
