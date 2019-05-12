// noinspection TsLint
import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';
import { simulateLogIn } from './common';
import { newTab, switchToTab } from './utils';

const packageConf = require('../package');

const PP_CSS_HIGHLIGHT_CLASS = 'pp-highlight';

// The full response is probably redundant
// but we'd better trim it carefully so it more or less reflects full API schema
const apiResponse = {
  'data': [{
    'id': '10',
    'type': 'annotationRequests',
    'attributes': {
      'comment': '',
      'createDate': '2019-05-12T11:22:09.458547Z',
      'quote': 'word2',
      'requestedByUser': true,
      'url': 'some-url',
      'relationships': { 'annotations': { 'data': [] } },
    },
  }],
};
// TODO: are displayed in popup
// TODO: can be viewed on mouse hover

describe('annotation requests are highlighted', () => {
  let browser;
  let apiServer;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>word1 word2 word3</p>');
  });

  apiApp.get('/api/annotationRequests/', (req, res) => {
    res.set('Content-Type', 'application/vnd.api+json');
    res.send(apiResponse);
  });

  apiApp.get('/api/annotations/', (req, res) => {
    res.set('Content-Type', 'application/vnd.api+json');
    res.send({ data: [] });
  });

  beforeAll(async () => {
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  beforeEach(async () => {
    browser = await buildBrowser();
  });

  test('annotation requests highlighted', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    await browser.findElement(By.css(`.${PP_CSS_HIGHLIGHT_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  afterEach(async () => {
    await browser.quit();
  });

  afterAll(async () => {
    await new Promise(resolve => apiServer.close(resolve));
  });
});
