
// Annotation request is not fully a JSON API model (it misses type id)
// (besides the missing "type" field the schema is compliant)

import { RangeAPIModel } from 'common/api/annotations';

import { APICreateModel, APIModel } from './json-api';

export interface AnnotationRequestCreateAttributes {
  url: string;
  quote?: string;
  notificationEmail?: string;
  comment?: string;
}

export interface AnnotationRequestAttributes {
  url: string;
  range?: RangeAPIModel;
  quote: string;
  quoteContext: string;
  // TODO: unused remove after v0.6
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
