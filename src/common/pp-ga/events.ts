import { sendEvent, sendEventByMessage, GACustomFieldsIndex, EventOptions } from './core';
import { formatBoolean, formatPriority, formatReason } from './utils';

// Extension Installation events

export function extensionInstalled() {
  // ExtensionUninstalled is implemented by backend after user is redirected to proper URL using UninstallURL hook
  sendEvent({ eventCategory: 'Extension', eventAction: 'Install', eventLabel: 'ExtensionInstalled' });
}

export function extensionUpgraded(previousVersion: string) {
  if (PPSettings.VERSION === previousVersion) {
    sendEvent({ eventCategory: 'Extension', eventAction: 'Reinstall', eventLabel: 'ExtensionReinstalled' });
  } else {
    sendEvent({ eventCategory: 'Extension', eventAction: 'Upgrade', eventLabel: 'ExtensionUpgraded' });
  }
}

export function extensionDisabledOnAllSites(options?: EventOptions) {
  sendEventByMessage(
    { eventCategory: 'Extension', eventAction: 'DisableOnAllSites', eventLabel: 'ExtensionDisabledOnSite' },
    options,
  );
}

// Extension Mode events

export function extensionEnabledOnAllSites(options?: EventOptions) {
  sendEventByMessage(
    { eventCategory: 'Extension', eventAction: 'EnableOnAllSites', eventLabel: 'ExtensionEnabledOnAllSites' },
    options,
  );
}

export function extensionDisabledOnSite(options?: EventOptions) {
  sendEventByMessage(
    { eventCategory: 'Extension', eventAction: 'DisableOnSite', eventLabel: 'ExtensionDisabledOnSite' },
    options,
  );
}

export function extensionEnabledOnSite(options?: EventOptions) {
  sendEventByMessage(
    { eventCategory: 'Extension', eventAction: 'EnableOnSite', eventLabel: 'ExtensionEnabledOnSite' },
    options,
  );
}

// Other extension-wide events

export function extensionReportButtonClicked(options?: EventOptions) {
  sendEventByMessage(
    { eventCategory: 'ExtensionReport', eventAction: 'Click', eventLabel: 'ExtensionReportButtonClicked' },
    options,
  );
}

// Annotation events

export function annotationDisplayed(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                    options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Display', eventLabel: 'AnnotationDisplayed',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationLinkClicked(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                      options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Click', eventLabel: 'AnnotationLinkClicked',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationAdded(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Add', eventLabel: 'AnnotationAdded',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationEdited(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                 options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Edit', eventLabel: 'AnnotationEdited',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationDeleted(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                  options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'Annotation', eventAction: 'Delete', eventLabel: 'AnnotationDeleted',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

// Annotation Form events

export function annotationAddFormOpened(triggeredBy: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationForm', eventAction: 'Open', eventLabel: 'AnnotationAddFormOpened',
    [GACustomFieldsIndex.triggeredBy]: triggeredBy,
  }, options);
}

export function annotationEditFormOpened(annotationId: string, priority: string, isCommentBlank: boolean,
                                         link: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationForm', eventAction: 'Open', eventLabel: 'AnnotationEditFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationFormMoved(options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationForm', eventAction: 'Move', eventLabel: 'AnnotationFormMoved',
  }, options);
}

// Annotation Summary events

export function annotationSummaryClicked(options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationSummary', eventAction: 'Click', eventLabel: 'AnnotationSummaryClicked',
  }, options);
}

export function annotationSummaryAnnotationClicked(annotationId: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationSummary', eventAction: 'Click', eventLabel: 'AnnotationSummaryAnnotationClicked',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

// Annotation Adding Mode events

export function annotationAddingModeInited(options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Init', eventLabel: 'AnnotationAddingModeInited',
  }, options);
}

export function annotationAddingModeCancelled(options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Cancel', eventLabel: 'AnnotationAddingModeCancelled',
  }, options);
}

// Annotation Request events

export function annotationRequestFormOpened(triggeredBy: string, isQuoteBlank: boolean = true,
                                            options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationRequestForm', eventAction: 'Open', eventLabel: 'AnnotationRequestFormOpened',
    [GACustomFieldsIndex.triggeredBy]: triggeredBy,
    [GACustomFieldsIndex.isQuoteBlank]: formatBoolean(isQuoteBlank),
  }, options);
}

export function annotationRequestSent(isQuoteBlank: boolean, isCommentBlank: boolean, isEmailBlank: boolean,
                                      options?: EventOptions) {
  sendEventByMessage({
      eventCategory: 'AnnotationRequest', eventAction: 'Send', eventLabel: 'AnnotationRequestSent',
      [GACustomFieldsIndex.isQuoteBlank]: formatBoolean(isQuoteBlank),
      [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
      [GACustomFieldsIndex.isEmailBlank]: formatBoolean(isEmailBlank),
    }, options);
}

// Annotation Upvote events

export function annotationUpvoted(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                  options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationUpvote', eventAction: 'Add', eventLabel: 'AnnotationUpvoted',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationUpvoteCancelled(annotationId: string, priority: string, isCommentBlank: boolean,
                                          link: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationUpvote', eventAction: 'Cancel', eventLabel: 'AnnotationUpvoteCancelled',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

// Annotation Report events

export function annotationReportFormOpened(annotationId: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationReportForm', eventAction: 'Open', eventLabel: 'AnnotationReportFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

export function annotationReportSent(annotationId: string, reason: string, isCommentBlank: boolean,
                                     options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationReport', eventAction: 'Send', eventLabel: 'AnnotationReportSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.reason]: formatReason(reason),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  }, options);
}

export function annotationSuggestionFormOpened(annotationId: string, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationSuggestionForm', eventAction: 'Open', eventLabel: 'AnnotationSuggestionFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

export function annotationSuggestionSent(annotationId: string, isCommentBlank: boolean, options?: EventOptions) {
  sendEventByMessage({
    eventCategory: 'AnnotationSuggestion', eventAction: 'Send', eventLabel: 'AnnotationSuggestionSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  }, options);
}
