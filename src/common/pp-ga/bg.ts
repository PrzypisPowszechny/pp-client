import FieldsObject = UniversalAnalytics.FieldsObject;
import cookieLib from 'cookie';
import * as retry from 'retry';

import gaScript from './ga.js';
import { EventOptions, GACustomFieldsIndex } from './types';
import { getIamstaffFromCookie } from './utils';

import { getChromeCookie, setChromeCookie } from '../chrome-cookies';

let bgInited = false;
let gaReady = false;

export function isGaRunningInWindow() {
  return bgInited;
}

function setGaReady() {
  gaReady = true;
}

export async function init() {
  bgInited = true;

  // GA needs to fetch actual script from external resource, so in case somebody starts browser without internet
  // we are going to retry it using exponential formula: minTimeout * 2**retriesNum. First retry in 5s, last after 60d.
  const operation = retry.operation({ minTimeout: 5000, retries: 20 });
  operation.attempt((num) => {
    gaScript();
  }, {
    // 3s timeout for ga to become ready
    timeout: 3000,
    cb: () => {
      if (!gaReady) {
        operation.retry(Error(`timeout: ga is not ready after 3s, it might be caused by being offline`));
      }
    },
  });

  const domain = window.location.host;

  // If chrome cookies are set for SITE and not set for bg, copy those cookies to bg
  const siteGaCookie = await getChromeCookie(PPSettings.SITE_URL, '_ga');
  const siteGidCookie = await getChromeCookie(PPSettings.SITE_URL, '_gid');
  const bgCookies = cookieLib.parse(document.cookie);
  if (siteGaCookie && siteGidCookie && !bgCookies._ga && !bgCookies._gid) {
    document.cookie = cookieLib.serialize('_ga', siteGaCookie.value, { domain });
    document.cookie = cookieLib.serialize('_gid', siteGidCookie.value, { domain });
  }

  // Al ga() are async in the way that those calls (args) are queued. When GA script is ready, it consumes all records.
  ga('create', PPSettings.GA_ID, domain);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', PPSettings.VERSION);

  // If SITE cookies are not set, wait for ga to finish the setup and propagate bg cookies to SITE
  if (!siteGaCookie && !siteGidCookie) {
    ga(setDomainCookiesOnGaReady);
  }
  ga(setGaReady);
}

function setDomainCookiesOnGaReady() {
  const bgCookies = cookieLib.parse(document.cookie);

  setChromeCookie(PPSettings.SITE_URL, '_ga', bgCookies._ga);
  setChromeCookie(PPSettings.SITE_URL, '_gid', bgCookies._gid);
}

export function sendEventFromMessage(request) {
  if (request.action === 'SEND_GA_EVENT') {
    sendEvent(request.fieldsObject, request.options).then(() => null);
  }
}

export async function sendEvent(fieldsObject: FieldsObject, options: EventOptions = {}) {
  const iamstaff = await getIamstaffFromCookie();
  if (iamstaff) {
    return;
  }
  if (options.location) {
    fieldsObject[GACustomFieldsIndex.eventUrl] = fieldsObject.location = options.location;
  }
  ga('send', 'event', fieldsObject);
}
