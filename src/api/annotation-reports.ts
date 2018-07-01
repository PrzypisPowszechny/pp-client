import { APICreateModel, APIModel, CreateRelation, Relation } from './json-api';

export const AnnotationReportResourceType = 'annotationReports';

export interface AnnotationReportAPIModel extends APIModel {
  relationships: {
    annotation: Relation;
  };
  attributes: AnnotationReportAPIModelAttrs;
}

export interface AnnotationReportAPICreateModel extends APICreateModel {
  relationships: {
    annotation: CreateRelation;
  };
  attributes: AnnotationReportAPIModelAttrs;
}

export interface AnnotationReportAPIModelAttrs {
    reason: Reasons;
    comment: string;
}

export enum Reasons {
  OTHER = 'OTHER',
  BIASED = 'BIASED',
  UNRELIABLE = 'UNRELIABLE',
  USELESS = 'USELESS',
  SPAM = 'SPAM',
  SUGGESTED_CORRECTION = 'SUGGESTED_CORRECTION',
}
