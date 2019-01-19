import gaScript from './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import cookieLib from 'cookie';
import { getIamstaffFromCookie } from './utils';
import { setChromeCookie, getChromeCookie } from '../chrome-cookies';
import { EventOptions, GACustomFieldsIndex } from './types';

let bgInited = false;

export function isBg() {
  return bgInited;
}

export async function init() {
  gaScript();
  const domain = window.location.host;

  // If chrome cookies are set for SITE and not set for bg, copy those cookies to bg
  const siteGaCookie = await getChromeCookie(PPSettings.SITE_URL, '_ga');
  const siteGidCookie = await getChromeCookie(PPSettings.SITE_URL, '_gid');
  const bgCookies = cookieLib.parse(document.cookie);
  if (siteGaCookie && siteGidCookie && !bgCookies._ga && !bgCookies._gid) {
    document.cookie = cookieLib.serialize('_ga', siteGaCookie.value, { domain });
    document.cookie = cookieLib.serialize('_gid', siteGidCookie.value, { domain });
  }

  ga('create', PPSettings.GA_ID, domain);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', PPSettings.VERSION);

  // If SITE cookies are not set, wait for ga to finish the setup and propagate bg cookies to SITE
  if (!siteGaCookie && !siteGidCookie) {
    ga(setDomainCookiesOnGaReady);
  }

  bgInited = true;
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
