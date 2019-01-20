// noinspection TsLint
import { waitUntil } from './utils';

import express from 'express';
import http from 'http';
import { By } from 'selenium-webdriver';
import { buildBrowser } from './browser';
import * as e2ePPSettings from './settings';

describe('extension runs normally', () => {
  let browser;
  let apiServer;
  let onAnnotationsRequest;

  const apiApp = express();
  apiApp.get('/site/some-text/', (req, res) => {
    res.send('<p>some text</p> here');
  });

  apiApp.get('/api/annotations/', (req, res) => {
    onAnnotationsRequest();
    res.set('Content-Type', 'application/vnd.api+json');
    res.send({ data: [] });
  });

  beforeAll( async () => {
    browser = await buildBrowser();
    onAnnotationsRequest = () => null;
    await new Promise( res => apiServer = http.createServer(apiApp).listen(e2ePPSettings.API_PORT, res));
  });

  test('fetches annotations on page open', async () => {
    await browser.get(`${e2ePPSettings.SITE_URL}/some-text/`);

    let areAnnotationsFetched = false;
    onAnnotationsRequest = () => areAnnotationsFetched = true;
    await expect(await waitUntil( () => areAnnotationsFetched)).toBeTruthy();

  }, e2ePPSettings.TIMEOUT);

  afterAll( async () => {
    await browser.quit();
    await new Promise( resolve => apiServer.close(resolve));
  });
});
