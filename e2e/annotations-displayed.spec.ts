import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './setup/browser';
import * as e2ePPSettings from './setup/settings';
import { simulateLogIn } from './shared/routines';
import { newTab, sleep, switchToTab } from './utils';

const packageConf = require('../package');

const PP_CSS_SCOPE_CLASS = 'pp-ui';
const PP_CSS_ANNOTATION_SUMMARY_PREFIX = 'AnnotationSummary__summaryItem';
const PP_CSS_VIEWER_CLASS_PREFIX = 'Viewer__self';
const PP_CSS_HIGHLIGHT_CLASS = 'pp-highlight';

// The full response is probably redundant
// but we'd better trim it carefully so it more or less reflects full API schema
const apiResponse = {
  'data': [
    {
      'type': 'annotations',
      'id': '1',
      'attributes': {
        'url': `some-url`,
        'range': null,
        'quote': 'word2',
        'quoteContext': '',
        'ppCategory': 'ADDITIONAL_INFO',
        'comment': 'mock comment',
        'annotationLink': 'http://mock-url.com',
        'annotationLinkTitle': 'mock title',
        'publisher': 'PP',
        'createDate': '2019-03-04T17:17:21Z',
        'upvoteCountExceptUser': 0,
        'doesBelongToUser': false
      },
      'relationships': {
        'user': {
          'links': {
            'related': 'https://devdeploy1.przypispowszechny.pl/api/annotations/1/user'
          },
          'data': {
            'type': 'users',
            'id': '1'
          }
        },
        'annotationRequest': {
          'data': null
        },
        'annotationUpvote': {
          'links': {
            'related': 'https://devdeploy1.przypispowszechny.pl/api/annotations/1/upvote'
          },
          'data': null
        }
      },
      'links': {
        'self': 'https://devdeploy1.przypispowszechny.pl/api/annotations/1'
      }
    },

  ]
};

describe('annotations are highlighted and can be viewed on mouse hover', () => {
  let browser;
  let apiServer;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>word1 word2 word3</p>');
  });

  apiApp.get('/api/annotationRequests/', (req, res) => {
    res.set('Content-Type', 'application/vnd.api+json');
    res.send({ data: []});
  });

  apiApp.get('/api/annotations/', (req, res) => {
    res.set('Content-Type', 'application/vnd.api+json');
    res.send(apiResponse);
  });

  beforeAll(async () => {
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  beforeEach(async () => {
    browser = await buildBrowser();
  });

  test('annotations highlighted', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    await browser.findElement(By.css(`.${PP_CSS_HIGHLIGHT_CLASS}`));
  }, e2ePPSettings.TIMEOUT);

  test('viewer displayed and lingering on hover', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    const highlightedWord = await browser.findElement(By.css(`.${PP_CSS_HIGHLIGHT_CLASS}`));
    await browser.actions().mouseMove(highlightedWord).perform();
    await browser.findElement(By.css(`.${PP_CSS_SCOPE_CLASS}[class*="${PP_CSS_VIEWER_CLASS_PREFIX}"]`));
    await sleep(500);
    // make sure the viewer lingers rather than just flashing
    await browser.findElement(By.css(`.${PP_CSS_SCOPE_CLASS}[class*="${PP_CSS_VIEWER_CLASS_PREFIX}"]`));
  }, e2ePPSettings.TIMEOUT);

  test('annotations displayed in popup', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);
    await newTab(browser);
    await switchToTab(browser, 1);
    await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html?devTabId=2`);
    await browser.findElement(By.css(`[class*="${PP_CSS_ANNOTATION_SUMMARY_PREFIX}"]`));
  }, e2ePPSettings.TIMEOUT);

  afterEach(async () => {
    await browser.quit();
  });

  afterAll(async () => {
    await new Promise(resolve => apiServer.close(resolve));
  });
});
