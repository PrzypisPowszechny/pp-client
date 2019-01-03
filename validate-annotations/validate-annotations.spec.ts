// noinspection TsLint
import { AnnotationPublishers } from '../src/common/api/annotations';
import { Builder, By, Key, ActionSequence, Button, until } from 'selenium-webdriver';

const packageConf = require('../package');
import fs, { appendFile } from 'fs';
import rimraf from 'rimraf';
import fetch from 'isomorphic-fetch';
import { buildBrowser } from './browser';
import * as validateAnnotationsPPSettings from './settings';
import {
  PP_DOM_NOTIFICATION_ID,
  seleniumGetAnnotationLocationInfo,
} from '../src/content-scripts/dom-notifications';

const outputDir = 'out-validate-annotations';
const fileConfig = {
  websites: `${outputDir}/websites.txt`,
  located: `${outputDir}/located.txt`,
  unlocated: `${outputDir}/unlocated.txt`,
  summary: `${outputDir}/summary.txt`,
};

async function fetchRetry(url, options, n) {
  let error;
  for (let i = 0; i < n; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      error = err;
      await sleep(2000);
    }
  }
  throw error;
}

async function clearOutputDir() {
  return await new Promise((resolve) => {
    rimraf(outputDir, () => {
      fs.mkdir(outputDir, () => {
        fs.writeFile(fileConfig.located, '', () => {
        });
        fs.writeFile(fileConfig.unlocated, '', () => {
        });
        resolve();
      });
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Extension locates annotations', () => {
  let browser;

  beforeAll(async () => {
    browser = await buildBrowser();
  });

  // Time to wait after the document is initialised until annotations are located
  const locateAnnotationsTimeout = 3000;

  test('Count all annotations', async () => {
    await clearOutputDir();

    let locatedSum = 0;
    let unlocatedSum = 0;
    let websiteFails = 0;
    let annotationCount = 0;
    const visitedURLs = [];
    const skip = 0;
    const pageLimit = 10;
    const sample = 10;
    let page = 0;
    let response;

    while ((!response || response.data.length > 0) && locatedSum + unlocatedSum <= sample) {
      const annotationEndpoint = `${validateAnnotationsPPSettings.API_URL}/annotations`;
      const url = encodeURI(`${annotationEndpoint}?page[limit]=${pageLimit}&page[offset]=${page * (pageLimit + skip)}`);
      console.log(`fetching annotations: ${url}`);
      response = await fetchRetry(url, {}, 10)
        .catch(error => fail(`Could not receive annotation from the endpoint: ${url}, error: ${error}`))
        .then(res => res.json())
        .then(async (res) => {
          for (const annotation of res.data) {
            const siteUrl = annotation.attributes.url;
            const publisher = annotation.attributes.publisher;
            console.log(publisher, siteUrl);
            if (publisher === AnnotationPublishers.DEMAGOG && visitedURLs.indexOf(siteUrl) === -1) {
              visitedURLs.push(siteUrl);
              console.log(`Visiting url...: ${siteUrl}`);
              try {
                await browser.get(siteUrl);
              } catch (err) {
                // todo check error type
                console.log(`Timeout loading website! Ignoring website ${siteUrl}`);
                fs.appendFile(fileConfig.websites,
                  [siteUrl, 'NaN', 'NaN', 'Unsuccessful loading website (perhaps timeout)'].join('\t') + '\n', (err) => {
                  });
                websiteFails++;
                continue;
              }
              console.log(`Waiting until annotations are located: ${siteUrl}`);
              let node;
              // wait until annotations are located
              const hrstart = process.hrtime();
              try {
                node = await browser.wait(
                  until.elementLocated(By.id(PP_DOM_NOTIFICATION_ID)),
                  locateAnnotationsTimeout);
              } catch (err) {
                // todo check error type
                console.log(`Timeout locating annotations! Ignoring website ${siteUrl}`);
                fs.appendFile(fileConfig.websites,
                  [siteUrl, 'NaN', 'NaN', 'Unsuccessful retrieving annotation location info (perhaps timeout)'].join('\t') + '\n', (err) => {
                  });
                websiteFails++;
                continue;
              }
              const hrend = process.hrtime(hrstart);

              const info = await seleniumGetAnnotationLocationInfo(node);
              const unlocatedDemagog = info.unlocated
                .filter(ann => ann.attributes.publisher === AnnotationPublishers.DEMAGOG);
              const locatedDemagog = info.located
                .filter(ann => ann.attributes.publisher === AnnotationPublishers.DEMAGOG);

              for (const locatedAnnotation of locatedDemagog) {
                const { id, attributes: { url, quote } } = locatedAnnotation;
                fs.appendFile(fileConfig.located, [id, url, quote].join('\t') + '\n', (err) => {
                });
              }

              for (const unlocatedAnnotation of unlocatedDemagog) {
                const { id, attributes: { url, quote } } = unlocatedAnnotation;
                fs.appendFile(fileConfig.unlocated, [id, url, quote].join('\t') + '\n', (err) => {
                });
              }
              annotationCount += locatedDemagog.length + unlocatedDemagog.length;

              locatedSum += locatedDemagog.length;
              unlocatedSum += unlocatedDemagog.length;
              console.log(`Located demagog annotations: ${locatedSum}/${locatedSum + unlocatedSum}`);
              const loadTime = `${hrend[1] / 1000000.}ms`;
              fs.appendFile(fileConfig.websites,
                [siteUrl, unlocatedDemagog.length, locatedDemagog.length, loadTime].join('\t') + '\n', (err) => {
                });
            }

          } // for annotation
          return res;
        }); // fetch an annotation chunk
      ++page;
    } // for annotation chunk

    const message = `
     Visited ${visitedURLs.length} URLs for ${annotationCount} annotations
     Successful URLs: ${visitedURLs.length - websiteFails}/${visitedURLs.length}
     Located annotations: ${locatedSum}/${locatedSum + unlocatedSum}
    `;
    console.log(message);
    fs.appendFile(fileConfig.summary, message, (err) => {
    });
  }, validateAnnotationsPPSettings.TIMEOUT);

  afterAll(async () => {
    await browser.quit();
  });
});
