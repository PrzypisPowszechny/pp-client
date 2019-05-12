
// Annotation request is not fully a JSON API model (it misses type id)
// (besides the missing "type" field the schema is compliant)

import { APICreateModel, APIModel } from './json-api';

export interface AnnotationRequestCreateAttributes {
  url: string;
  quote?: string;
  notificationEmail?: string;
  comment?: string;
}

export interface AnnotationRequestAttributes {
  url: string;
  quote: string;
  notificationEmail?: string;
  comment: string;
  requestedByUser: boolean;
  createDate: Date;
}

export interface AnnotationRequestAPICreateModel extends APICreateModel {
  attributes: AnnotationRequestCreateAttributes;
}

export interface AnnotationRequestAPIModel extends APIModel {
  attributes: AnnotationRequestAttributes;
}
