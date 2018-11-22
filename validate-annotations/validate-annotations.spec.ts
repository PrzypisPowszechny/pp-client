// noinspection TsLint
const packageConf = require('../package');
import { By, until } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as validateAnnotationsPPSettings from './settings';
import {
  PP_DOM_NOTIFICATION_ID,
  seleniumGetAnnotationLocationInfo,
} from '../src/content-scripts/dom-notifications';

// TODO run for all Demagog annotations from API
describe('Extension locates annotations', () => {
  let browser;
  const url = 'https://www.polskieradio.pl/13/53/Artykul/2175283,Sygnaly-Dnia-6-sierpnia-2018-roku-rozmowa-z-Andrzejem-Halickim';

  beforeAll(async () => {
    browser = await buildBrowser();
  });

  test('located annotation', async () => {
    await browser.get(url);
    const node = await browser.wait(
      until.elementLocated(By.id(PP_DOM_NOTIFICATION_ID)),
      validateAnnotationsPPSettings.TIMEOUT);
    const info = await seleniumGetAnnotationLocationInfo(node);
    expect(info.unlocated).toEqual(0);
    expect(info.located).toBeGreaterThan(0);
  }, validateAnnotationsPPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
  });
});
