import { ILocationData } from 'common/store/tabs/tab/annotations/actions';

export function syncBadgeWithAnnotations(locationData: ILocationData, tabId) {
  const count = locationData.located.length + locationData.unlocated.length;
  const text = count > 0 ? count.toString() : '';
  chrome.browserAction.setBadgeText({ text, tabId });
}
