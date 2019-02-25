// Messages sent by content script / popup to background

import { checkResponse } from './utils';

export function setExtensionBadge(text: string) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'SET_BADGE',
      text,
    }, (response) => {
      let value;
      let error;
      [value, error] = checkResponse(response, 'initializeTabId');
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  });
}

export function getExtensionCookie(name: string): Promise<string | null> {
  // Read special per-extension cookie
  // available not for the host domain (unlike traditional website cookies) but for this particular extension client
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'GET_COOKIE', name }, (response) => {
      let cookie;
      let error;
      [cookie, error] = checkResponse(response, 'initializeTabId');
      if (error) {
        reject(error);
      }
      resolve(cookie.value);
    });
  });
}
