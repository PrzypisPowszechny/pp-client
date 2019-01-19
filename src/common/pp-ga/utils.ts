import { annotationPPCategoriesLabels } from 'common/api/annotations';
import chromeStorage from '../chrome-storage';
import * as chromeKeys from '../chrome-storage/keys';
import { getChromeCookie } from '../chrome-cookies';

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
  return getChromeCookie(PPSettings.SITE_URL, 'pp_iamstaff').then(Boolean);
}
