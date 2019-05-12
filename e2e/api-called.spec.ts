// noinspection TsLint
import { waitUntil } from './utils';

import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';
import { simulateLogIn } from './common';

describe('extension calls api on startup', () => {
  let browser;
  let apiServer;
  let onAnnotationsRequest;
  let onAnnotationRequestsRequest;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });

  apiApp.get('/api/annotations/', (req, res) => {
    onAnnotationsRequest();
    res.set('Content-Type', 'application/vnd.api+json');
    res.send({ data: [] });
  });

  apiApp.get('/api/annotationRequests/', (req, res) => {
    onAnnotationRequestsRequest();
    res.set('Content-Type', 'application/vnd.api+json');
    res.send({ data: [] });
  });

  beforeAll(async () => {
    browser = await buildBrowser();
    onAnnotationsRequest = () => null;
    onAnnotationRequestsRequest = () => null;
    await new Promise(res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  test('fetches annotations on page open', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);

    let areAnnotationsFetched = false;
    onAnnotationsRequest = () => areAnnotationsFetched = true;
    await expect(await waitUntil(() => areAnnotationsFetched)).toBeTruthy();

  }, e2ePPSettings.TIMEOUT);

  test('fetches annotation requests on page open', async () => {
    await simulateLogIn(browser);
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);

    let areAnnotationRequestsFetched = false;
    onAnnotationRequestsRequest = () => areAnnotationRequestsFetched = true;
    await expect(await waitUntil(() => areAnnotationRequestsFetched)).toBeTruthy();

  }, e2ePPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
    await new Promise(resolve => apiServer.close(resolve));
  });
});
