import gaScript from './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import cookieLib from 'cookie';
import { getIamstaff, getIamstaffFromCookie, setIamstaff } from './utils';
import { setChromeCookie, getChromeCookie } from '../chrome-cookies';
import * as Sentry from '@sentry/browser';

export interface EventOptions {
  // Specify this option if the location cannot be sourced from window.location.href or want to override it
  location?: string;
}

export const GACustomFieldsIndex = {
  eventUrl: 'dimension1',
  triggeredBy: 'dimension2',
  priority: 'dimension3',
  reason: 'dimension4',
  isCommentBlank: 'dimension5',
  annotationId: 'dimension6',
  annotationLink: 'dimension7',
  isQuoteBlank: 'dimension8',
  isEmailBlank: 'dimension9',
};

export async function init() {
  gaScript();

  const bgCookies = cookieLib.parse(document.cookie);

  // If chrome cookies are set for SITE and not set for bg, copy those cookies to bg
  const siteGaCookie = await getChromeCookie(PPSettings.SITE_URL, '_ga');
  const siteGidCookie = await getChromeCookie(PPSettings.SITE_URL, '_gid');
  if (siteGaCookie && siteGidCookie && !bgCookies._ga && !bgCookies._gid) {
    document.cookie = cookieLib.serialize('_ga', siteGaCookie);
    document.cookie = cookieLib.serialize('_gid', siteGidCookie);
  }

  ga('create', PPSettings.GA_ID);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', PPSettings.VERSION);

  // If SITE cookies are not set, wait for ga to finish the setup and propagate bg cookies to SITE
  if (!siteGaCookie && !siteGidCookie) {
    ga(setDomainCookiesOnGaReady);
  }
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

export function sendEventByMessage(fieldsObject: FieldsObject, options: EventOptions = {}) {
  if (!options.location && window.location.href.startsWith('http')) {
    options.location = window.location.href;
  }
  chrome.runtime.sendMessage({ action: 'SEND_GA_EVENT', fieldsObject, options });
}
