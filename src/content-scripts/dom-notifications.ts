
/*
 * API for communicating and checkings the application state via DOM
 * useful for selenium automation, where console logs cannot be easily accessed
 */

import { AnnotationAPIModel } from 'common/api/annotations';

export const PP_DOM_NOTIFICATION_ID = 'pp-dom-notification-element';

function getPPNotificationDiv() {
  let node = document.getElementById(PP_DOM_NOTIFICATION_ID);
  if (!node) {
    node = document.createElement('div');
    node.id = PP_DOM_NOTIFICATION_ID;
  }
  return node;
}

export interface DomNotificationsLocationInfo {
  located: AnnotationAPIModel[];
  unlocated: AnnotationAPIModel[];
}

export function setAnnotationLocationInfo(info: DomNotificationsLocationInfo) {
  const node = getPPNotificationDiv();
  node.dataset.location_info = JSON.stringify(info);
  // Insert the div with the data set (so selenium does not capture it with missing attributes)
  window.document.body.appendChild(node);

}

export async function seleniumGetAnnotationLocationInfo(seleniumNode): Promise<DomNotificationsLocationInfo> {
  return await JSON.parse(await seleniumNode.getAttribute('data-location_info'));
}
