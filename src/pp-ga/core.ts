import './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import packageConf from '../../package.json';

const GA_ID_PROD = 'UA-123054125-1';
const GA_ID_DEV = 'UA-123054125-2';

export const GACustomFieldsIndex = {
  eventUrl: 'dimension1',
  triggeredBy: 'dimension2',
  priority: 'dimension3',
  reason: 'dimension4',
  isCommentBlank: 'dimension5',
  annotationId: 'dimension6',
  annotationLink: 'dimension7',
};

export function init() {
  ga('create', PP_SETTINGS.DEV ? GA_ID_DEV : GA_ID_PROD);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', packageConf.version);
}

export function sendEventFromMessage(request) {
  if (request.action === 'SEND_GA_EVENT') {
    sendEvent(request.fieldsObject);
  }
}

export function sendEvent(fieldsObject: FieldsObject) {
  ga('send', 'event', fieldsObject);
}

export function sendEventByMessage(fieldsObject: FieldsObject) {
  if (window.location.href.startsWith('http')) {
    fieldsObject[GACustomFieldsIndex.eventUrl] = fieldsObject.location = window.location.href;
  }
  chrome.runtime.sendMessage({ action: 'SEND_GA_EVENT', fieldsObject });
}
