const url = 'https://www.actionherojs.com';

import { Builder, By, Key, until } from 'selenium-webdriver';

import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';

const screen = {
  width: 1280,
  height: 800,
};

describe('www.actionherojs.com#index', () => {
  const browser = new Builder().forBrowser('firefox')
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();

  test('it renders', async () => {
    await browser.get(url);
    const title = await browser.findElement(By.tagName('h2')).getText();
    expect(title).toContain('reusable, scalable, and quick');
  });

  test('loads the latest version number from GitHub', async () => {
    const foundAndLoadedCheck = async () => {
      await until.elementLocated(By.id('latestRelease'));
      const value = await browser.findElement(By.id('latestRelease')).getText();
      return value !== '~';
    };

    await browser.wait(foundAndLoadedCheck, 3000);
    const latestRelease = await browser.findElement(By.id('latestRelease')).getText();
    expect(latestRelease).toEqual('v17.1.3');
  });

  describe('save a screenshot from the browser', () => {
    test('save a picture', async () => {
      // files saved in ./reports/screenshots by default
      await browser.get(url);
      await browser.takeScreenshot();
    });
  });

  afterAll(async () => {
    await browser.quit();
  });
});
