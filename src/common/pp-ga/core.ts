import gaScript from './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import cookieLib from 'cookie';
import { getIamstaff, getIamstaffFromCookie, setIamstaff } from './utils';
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

export function init() {
  gaScript();
  ga('create', PPSettings.GA_ID, { cookieDomain: 'localhost'/* PPSettings.API_HOST */  });
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', PPSettings.VERSION);

  setDomainCookies();
}

function setDomainCookies() {
  const cookies = cookieLib.parse(document.cookie);
  setChromeCookie(PPSettings.SITE_URL, '_ga', cookies._ga);
  setChromeCookie(PPSettings.SITE_URL, '_gid', cookies._gid);
}

function setChromeCookie(url: string, name: string, value: string) {
  chrome.cookies.set({
    url,
    name,
    value,
  }, (cookie: chrome.cookies.Cookie) => {
    if (!cookie) {
      Sentry.captureException(chrome.runtime.lastError);
    }
  });
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
