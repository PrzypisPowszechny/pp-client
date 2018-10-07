import { sendEvent, sendEventByMessage, GACustomFieldsIndex } from './core';
import { formatBoolean, formatPriority, formatReason } from './utils';
import packageConf from '../../../package.json';

export function extensionInstalled() {
  sendEvent({ eventCategory: 'Extension', eventAction: 'Install', eventLabel: 'ExtensionInstalled' });
}

export function extensionUpgraded(previousVersion: string) {
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

export function extensionDisabledOnAllSites(currentUrl: string) {
  sendEventByMessage({
    eventCategory: 'Extension', eventAction: 'DisableOnAllSites', eventLabel: 'ExtensionDisabledOnSite',
    [GACustomFieldsIndex.eventUrl]: currentUrl,
    location: currentUrl,
  });
}

export function extensionEnabledOnAllSites(currentUrl: string) {
  sendEventByMessage({
    eventCategory: 'Extension', eventAction: 'EnableOnAllSites', eventLabel: 'ExtensionEnabledOnAllSites',
    [GACustomFieldsIndex.eventUrl]: currentUrl,
    location: currentUrl,
  });
}

export function extensionDisabledOnSite(url: string) {
  sendEventByMessage({
    eventCategory: 'Extension', eventAction: 'DisableOnSite', eventLabel: 'ExtensionDisabledOnSite',
    [GACustomFieldsIndex.eventUrl]: url,
    location: url,
  });
}

export function extensionEnabledOnSite(url: string) {
  sendEventByMessage({
    eventCategory: 'Extension', eventAction: 'EnableOnSite', eventLabel: 'ExtensionEnabledOnSite',
    [GACustomFieldsIndex.eventUrl]: url,
    location: url,
  });
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

export function annotationAddFormDisplayed(triggeredBy: string) {
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

export function annotationEditFormDisplayed(annotationId: string, priority: string, isCommentBlank: boolean,
                                            link: string) {
  sendEventByMessage({
    eventCategory: 'AnnotationEditForm', eventAction: 'Display', eventLabel: 'AnnotationEditFormDisplayed',
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

export function annotationDeleted(annotationId: string, priority: string, isCommentBlank: boolean, link: string) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Delete', eventLabel: 'AnnotationDeleted',
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
