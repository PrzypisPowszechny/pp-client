import { annotationPPCategoriesLabels } from 'common/api/annotations';

import { getChromeCookie } from '../chrome-cookies';
import * as chromeKeys from '../chrome-storage/keys';

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
  chrome.storage.local.set({ [chromeKeys.IAMSTAFF]: Boolean(val) });
}

export function getIamstaff(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    chrome.storage.local.get([chromeKeys.IAMSTAFF], result => resolve(result[chromeKeys.IAMSTAFF]));
  });
}

export function getIamstaffFromCookie(): Promise<boolean> {
  return getChromeCookie(PPSettings.SITE_URL, 'pp_iamstaff').then(Boolean);
}
