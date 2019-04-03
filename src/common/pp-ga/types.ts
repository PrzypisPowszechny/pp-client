export interface EventOptions {
  // Specify this option if the location cannot be sourced from window.location.href or want to override it
  location?: string;
}

export const GACustomFieldsIndex = {
  eventUrl: 'dimension1',
  triggeredBy: 'dimension2',
  priority: 'dimension3',
  reason: 'dimension4',
  isCommentBlank: 'dimension5',
  annotationId: 'dimension6',
  annotationLink: 'dimension7',
  isQuoteBlank: 'dimension8',
};
