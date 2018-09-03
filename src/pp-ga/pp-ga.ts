import './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import packageConf from '../../package.json';
import { annotationPrioritiesLabels } from '../api/annotations';

const GA_ID_PROD = 'UA-123054125-1';
const GA_ID_DEV = 'UA-123054125-2';

const GACustomFieldsIndex = {
  eventUrl: 'dimension1',
  priority: 'dimension2',
  triggeredBy: 'dimension3',
  reason: 'dimension4',
  isCommentBlank: 'dimension5',
  annotationId: 'dimension6',
  annotationLink: 'dimension7',
};

function sendEvent(fieldsObject: FieldsObject) {
  ga('send', 'event', fieldsObject);
}

function sendEventByMessage(fieldsObject: FieldsObject) {
  chrome.runtime.sendMessage({ action: 'SEND_GA_EVENT', fieldsObject });
}

export function init() {
  ga('create', PP_SETTINGS.DEV ? GA_ID_DEV : GA_ID_PROD);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', packageConf.version);
}

export function sendEventFromMessage(request) {
  if (request.action === 'SEND_GA_EVENT') {
    sendEvent(request.fieldsObject);
  }
}

export function extensionInstalled() {
  sendEvent({ eventCategory: 'Extension', eventAction: 'install', eventLabel: 'ExtensionInstalled' });
}

export function extensionUpgradedFrom(previousVersion: string) {
  if (packageConf.version === previousVersion) {
    sendEvent({ eventCategory: 'Extension', eventAction: 'reinstall', eventLabel: 'ExtensionReinstalled' });
  } else {
    sendEvent({ eventCategory: 'Extension', eventAction: 'upgrade', eventLabel: 'ExtensionUpgraded' });
  }
}

// This need to be in fact implemented on our site frontend, not in the extension
export function extensionUninstalled() {
  sendEvent({eventCategory: 'Extension', eventAction: 'uninstall', eventLabel: 'ExtensionUninstalled' });
}

export function annotationDisplayed(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotations', eventAction: 'display', eventLabel: 'AnnotationDisplayed',
    [GACustomFieldsIndex.eventUrl]: window.location,
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: isCommentBlank,
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

function formatPriority(priority) {
  return `${priority} - ${annotationPrioritiesLabels[priority]}`;
}
