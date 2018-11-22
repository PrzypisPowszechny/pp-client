
/*
 * API for communicating and checkings the application state via DOM
 * useful for selenium automation, where console logs cannot be easily accessed
 */

export const PP_DOM_NOTIFICATION_ID = 'pp-dom-notification-element';

function getOrCreatePPNotificationDiv() {
  let node = document.getElementById(PP_DOM_NOTIFICATION_ID);
  if (!node) {
    node = document.createElement('div');
    node.id = PP_DOM_NOTIFICATION_ID;
    window.document.body.appendChild(node);
  }
  return node;
}

export function setAnnotationLocationInfo(located: number, unlocated: number) {
  const node = getOrCreatePPNotificationDiv();
  node.dataset.located = String(located);
  node.dataset.unlocated = String(unlocated);
}

export async function seleniumGetAnnotationLocationInfo(seleniumNode) {
  return {
    located: Number(await seleniumNode.getAttribute('data-located')),
    unlocated: Number(await seleniumNode.getAttribute('data-unlocated')),
  };

}
