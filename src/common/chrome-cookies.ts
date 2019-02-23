import * as Sentry from '@sentry/browser';
import Cookie = chrome.cookies.Cookie;

export function getChromeCookie(url: string, name: string): Promise<Cookie> {
  return new Promise<Cookie>((resolve, reject) => {
      chrome.cookies.get(
        { url, name },
        (cookie: Cookie) => {
          if (chrome.runtime.lastError) {
            Sentry.captureException(chrome.runtime.lastError);
            // This will be undefined in this case
            resolve(cookie);
          }
          resolve(cookie);
        },
      );
  });
}

export function setChromeCookie(url: string, name: string, value: string) {
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
