import { annotationPPCategoriesLabels } from 'common/api/annotations';
import chromeStorage from '../chrome-storage';
import * as chromeKeys from '../chrome-storage/keys';
import Cookie = chrome.cookies.Cookie;
import * as Sentry from '@sentry/browser';

export function formatPriority(priority) {
  return `${priority} - ${annotationPPCategoriesLabels[priority]}`;
}

export function formatBoolean(val: boolean) {
  return val ? 'True' : 'False';
}

export function formatReason(reason) {
  return `${reason}`;
}

export function setIamstaff(val) {
  chromeStorage.set({ [chromeKeys.IAMSTAFF]: Boolean(val) });
}

export function getIamstaff(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    chromeStorage.get([chromeKeys.IAMSTAFF], result => resolve(result[chromeKeys.IAMSTAFF]));
  });
}

export function getIamstaffFromCookie(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      chrome.cookies.get(
        {
          url: PPSettings.SITE_URL,
          name: 'pp_iamstaff',
        },
        (cookie: Cookie) => {
          if (chrome.runtime.lastError) {
            Sentry.captureException(chrome.runtime.lastError);
            resolve(false);
          }
          resolve(Boolean(cookie));
        },
      );
  });

}
