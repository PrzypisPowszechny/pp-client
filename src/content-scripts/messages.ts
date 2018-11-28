
export function setExtensionBadge(text: string) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'SET_BADGE', text }, (response) => {
      if (response) {
        resolve(response);
      } else {
        resolve(null);
      }
    });
  });
}

export function getExtensionCookie(name: string) {
  // Read special per-extension cookie
  // available not for the host domain (unlike traditional website cookies) but for this particular extension client
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'GET_COOKIE', name }, (response) => {
      if (response) {
        resolve(response.value);
      } else {
        resolve(null);
      }
    });
  });
}
