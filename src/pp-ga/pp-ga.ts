import './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import packageConf from '../../package.json';
import { annotationPrioritiesLabels } from '../api/annotations';

const GA_ID_PROD = 'UA-123054125-1';
const GA_ID_DEV = 'UA-123054125-2';

const GACustomFieldsIndex = {
  eventUrl: 'dimension1',
  triggeredBy: 'dimension2',
  priority: 'dimension3',
  reason: 'dimension4',
  isCommentBlank: 'dimension5',
  annotationId: 'dimension6',
  annotationLink: 'dimension7',
};

function sendEvent(fieldsObject: FieldsObject) {
  ga('send', 'event', fieldsObject);
}

function sendEventByMessage(fieldsObject: FieldsObject) {
  if (window.location.href.startsWith('http')) {
    fieldsObject[GACustomFieldsIndex.eventUrl] = fieldsObject.location = window.location.href;
  }
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
  sendEvent({ eventCategory: 'Extension', eventAction: 'Install', eventLabel: 'ExtensionInstalled' });
}

export function extensionUpgradedFrom(previousVersion: string) {
  if (packageConf.version === previousVersion) {
    sendEvent({ eventCategory: 'Extension', eventAction: 'Reinstall', eventLabel: 'ExtensionReinstalled' });
  } else {
    sendEvent({ eventCategory: 'Extension', eventAction: 'Upgrade', eventLabel: 'ExtensionUpgraded' });
  }
}

// This need to be in fact implemented on our site frontend, not in the extension
export function extensionUninstalled() {
  sendEvent({eventCategory: 'Extension', eventAction: 'Uninstall', eventLabel: 'ExtensionUninstalled' });
}

export function annotationDisplayed(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Display', eventLabel: 'AnnotationDisplayed',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationLinkClicked(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Click', eventLabel: 'AnnotationLinkClicked',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationAddingModeInited() {
  sendEventByMessage({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Init', eventLabel: 'AnnotationAddingModeInited',
  });
}

export function annotationAddingModeCancelled() {
  sendEventByMessage({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Cancel', eventLabel: 'AnnotationAddingModeCancelled',
  });
}

export function annotationAddFormDisplayed(triggeredBy) {
  sendEventByMessage({
    eventCategory: 'AnnotationAddForm', eventAction: 'Display', eventLabel: 'AnnotationAddFormDisplayed',
    [GACustomFieldsIndex.triggeredBy]: triggeredBy,
  });
}

export function annotationAdded(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Add', eventLabel: 'AnnotationAdded',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationEdited(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Edit', eventLabel: 'AnnotationEdited',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationFormMoved() {
  sendEventByMessage({
    eventCategory: 'AnnotationForm', eventAction: 'Move', eventLabel: 'AnnotationFormMoved',
  });
}

export function annotationUpvoted(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Upvote', eventLabel: 'AnnotationUpvoted',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationUpvoteCancelled(annotationId: string, priority: string, isCommentBlank: boolean,
                                          link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'UpvoteCancel', eventLabel: 'AnnotationUpvoteCancelled',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  });
}

export function annotationReportFormOpened(annotationId: string) {
  sendEventByMessage({
    eventCategory: 'AnnotationReportForm', eventAction: 'Open', eventLabel: 'AnnotationReportFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  });
}

export function annotationReportSent(annotationId: string, reason: string, isCommentBlank: boolean) {
  sendEventByMessage({
    eventCategory: 'AnnotationReport', eventAction: 'Send', eventLabel: 'AnnotationReportSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.reason]: formatReason(reason),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  });
}

export function annotationSuggestionFormOpened(annotationId: string) {
  sendEventByMessage({
    eventCategory: 'AnnotationSuggestionForm', eventAction: 'Open', eventLabel: 'AnnotationSuggestionFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  });
}

export function annotationSuggestionSent(annotationId: string, isCommentBlank: boolean) {
  sendEventByMessage({
    eventCategory: 'AnnotationSuggestion', eventAction: 'Send', eventLabel: 'AnnotationSuggestionSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  });
}

function formatPriority(priority) {
  return `${priority} - ${annotationPrioritiesLabels[priority]}`;
}

function formatBoolean(val: boolean) {
  return val ? 'True' : 'False';
}

function formatReason(reason) {
  return `${reason}`;
}
