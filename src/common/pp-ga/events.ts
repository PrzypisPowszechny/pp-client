import { sendEvent } from './client';
import { formatBoolean, formatPriority, formatReason } from './utils';
import { EventOptions, GACustomFieldsIndex } from './types';

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
  sendEvent(
    { eventCategory: 'Extension', eventAction: 'DisableOnAllSites', eventLabel: 'ExtensionDisabledOnSite' },
    options,
  );
}

// Extension Mode events

export function extensionEnabledOnAllSites(options?: EventOptions) {
  sendEvent(
    { eventCategory: 'Extension', eventAction: 'EnableOnAllSites', eventLabel: 'ExtensionEnabledOnAllSites' },
    options,
  );
}

export function extensionDisabledOnSite(options?: EventOptions) {
  sendEvent(
    { eventCategory: 'Extension', eventAction: 'DisableOnSite', eventLabel: 'ExtensionDisabledOnSite' },
    options,
  );
}

export function extensionEnabledOnSite(options?: EventOptions) {
  sendEvent(
    { eventCategory: 'Extension', eventAction: 'EnableOnSite', eventLabel: 'ExtensionEnabledOnSite' },
    options,
  );
}

// Other extension-wide events

export function extensionReportButtonClicked(options?: EventOptions) {
  sendEvent(
    { eventCategory: 'ExtensionReport', eventAction: 'Click', eventLabel: 'ExtensionReportButtonClicked' },
    options,
  );
}

// Annotation events

export function annotationDisplayed(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                    options?: EventOptions) {
  sendEvent({
    eventCategory: 'Annotation', eventAction: 'Display', eventLabel: 'AnnotationDisplayed',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationLinkClicked(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                      options?: EventOptions) {
  sendEvent({
    eventCategory: 'Annotation', eventAction: 'Click', eventLabel: 'AnnotationLinkClicked',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationAdded(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                options?: EventOptions) {
  sendEvent({
    eventCategory: 'Annotation', eventAction: 'Add', eventLabel: 'AnnotationAdded',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationEdited(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                 options?: EventOptions) {
  sendEvent({
    eventCategory: 'Annotation', eventAction: 'Edit', eventLabel: 'AnnotationEdited',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationDeleted(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                  options?: EventOptions) {
  sendEvent({
    eventCategory: 'Annotation', eventAction: 'Delete', eventLabel: 'AnnotationDeleted',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

// Annotation Form events

export function annotationAddFormOpened(triggeredBy: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationForm', eventAction: 'Open', eventLabel: 'AnnotationAddFormOpened',
    [GACustomFieldsIndex.triggeredBy]: triggeredBy,
  }, options);
}

export function annotationEditFormOpened(annotationId: string, priority: string, isCommentBlank: boolean,
                                         link: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationForm', eventAction: 'Open', eventLabel: 'AnnotationEditFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationFormMoved(options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationForm', eventAction: 'Move', eventLabel: 'AnnotationFormMoved',
  }, options);
}

// Annotation Summary events

export function annotationSummaryClicked(options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationSummary', eventAction: 'Click', eventLabel: 'AnnotationSummaryClicked',
  }, options);
}

export function annotationSummaryAnnotationClicked(annotationId: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationSummary', eventAction: 'Click', eventLabel: 'AnnotationSummaryAnnotationClicked',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

// Annotation Adding Mode events

export function annotationAddingModeInited(options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Init', eventLabel: 'AnnotationAddingModeInited',
  }, options);
}

export function annotationAddingModeCancelled(options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationAddingMode', eventAction: 'Cancel', eventLabel: 'AnnotationAddingModeCancelled',
  }, options);
}

// Annotation Request events

export function annotationRequestFormOpened(triggeredBy: string, isQuoteBlank: boolean = true,
                                            options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationRequestForm', eventAction: 'Open', eventLabel: 'AnnotationRequestFormOpened',
    [GACustomFieldsIndex.triggeredBy]: triggeredBy,
    [GACustomFieldsIndex.isQuoteBlank]: formatBoolean(isQuoteBlank),
  }, options);
}

export function annotationRequestSent(isQuoteBlank: boolean, isCommentBlank: boolean,
                                      options?: EventOptions) {
  sendEvent({
      eventCategory: 'AnnotationRequest', eventAction: 'Send', eventLabel: 'AnnotationRequestSent',
      [GACustomFieldsIndex.isQuoteBlank]: formatBoolean(isQuoteBlank),
      [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    }, options);
}

// Annotation Upvote events

export function annotationUpvoted(annotationId: string, priority: string, isCommentBlank: boolean, link: string,
                                  options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationUpvote', eventAction: 'Add', eventLabel: 'AnnotationUpvoted',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

export function annotationUpvoteCancelled(annotationId: string, priority: string, isCommentBlank: boolean,
                                          link: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationUpvote', eventAction: 'Cancel', eventLabel: 'AnnotationUpvoteCancelled',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.priority]: formatPriority(priority),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
    [GACustomFieldsIndex.annotationLink]: link,
  }, options);
}

// Annotation Report events

export function annotationReportFormOpened(annotationId: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationReportForm', eventAction: 'Open', eventLabel: 'AnnotationReportFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

export function annotationReportSent(annotationId: string, reason: string, isCommentBlank: boolean,
                                     options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationReport', eventAction: 'Send', eventLabel: 'AnnotationReportSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.reason]: formatReason(reason),
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  }, options);
}

export function annotationSuggestionFormOpened(annotationId: string, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationSuggestionForm', eventAction: 'Open', eventLabel: 'AnnotationSuggestionFormOpened',
    [GACustomFieldsIndex.annotationId]: annotationId,
  }, options);
}

export function annotationSuggestionSent(annotationId: string, isCommentBlank: boolean, options?: EventOptions) {
  sendEvent({
    eventCategory: 'AnnotationSuggestion', eventAction: 'Send', eventLabel: 'AnnotationSuggestionSent',
    [GACustomFieldsIndex.annotationId]: annotationId,
    [GACustomFieldsIndex.isCommentBlank]: formatBoolean(isCommentBlank),
  }, options);
}
