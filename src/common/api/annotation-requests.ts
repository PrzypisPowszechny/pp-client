
// Annotation request is not fully a JSON API model (it misses type id)
// (besides the missing "type" field the schema is compliant)

import { APICreateModel } from './json-api';

export interface AnnotationRequestAttributes {
  url: string;
  quote?: string;
  notificationEmail?: string;
  comment?: string;
}

export interface AnnotationRequestAPICreateModel extends APICreateModel {
  attributes: AnnotationRequestAttributes;
}
