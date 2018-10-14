import gaScript from './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import packageConf from '../../../package.json';
import cookie from 'cookie';
import chromeStorage from 'common/chrome-storage';
import * as chromeKeys from 'common/chrome-storage/keys';

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
  gaScript();
  ga('create', PP_SETTINGS.DEV ? GA_ID_DEV : GA_ID_PROD);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', packageConf.version);

  sendInitPing();
}

interface InitPingResponseData {
  iamstaff: boolean;
}

function sendInitPing() {
  // Use help of our server to set GA cookies for our domain just as it would normally happen if we were not extension
  // but website. Use neutral name of the endpoint used.
  // If anything more ever needs to be send on init it is good starting point - it can be added here.
  const cookies = cookie.parse(document.cookie);
  fetch(PP_SETTINGS.SITE_URL + '/pings/init/', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept': 'application/json',
    },
    method: 'post',
    body: `ga_cookie=${cookies._ga}&gid_cookie=${cookies._gid}`,
  }).then(response => response.json())
    .then((data: InitPingResponseData) => {
      setIamstaff(data.iamstaff);
    })
    .catch(errors => console.log(errors));
}

function setIamstaff(val) {
  chromeStorage.set({ [chromeKeys.IAMSTAFF]: Boolean(val) });
}

function getIamstaff(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    chromeStorage.get([chromeKeys.IAMSTAFF], result => resolve(result[chromeKeys.IAMSTAFF]));
  });
}

export function sendEventFromMessage(request) {
  if (request.action === 'SEND_GA_EVENT') {
    sendEvent(request.fieldsObject);
  }
}

// TODO: use iamstaff value from local store which would be synced with chrome storage
export function sendEvent(fieldsObject: FieldsObject) {
  getIamstaff().then( (iamstaff) => {
    if (iamstaff) {
      return;
    }
    ga('send', 'event', fieldsObject);
  });
}

export function sendEventByMessage(fieldsObject: FieldsObject) {
  if (window.location.href.startsWith('http')) {
    fieldsObject[GACustomFieldsIndex.eventUrl] = fieldsObject.location = window.location.href;
  }
  chrome.runtime.sendMessage({ action: 'SEND_GA_EVENT', fieldsObject });
}
