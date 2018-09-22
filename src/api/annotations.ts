import { APICreateModel, APIModel, Relation } from './json-api';

export const AnnotationResourceType = 'annotations';

export interface AnnotationAPIModel extends APIModel {
  attributes: AnnotationAPIModelAttrs;
  relationships: {
    annotationUpvote: Relation;
  };
}

export interface AnnotationAPICreateModel extends APICreateModel {
  attributes: AnnotationAPICreateModelAttrs;
}

export interface AnnotationAPIModelAttrs {
  url: string;
  range: RangeAPIModel;
  quote: string;
  quoteContext: string;
  ppCategory: AnnotationPPCategories;
  demagogCategory: AnnotationDemagogCategories;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  createDate?: Date;
  upvoteCountExceptUser: number;
  doesBelongToUser: boolean;
}

export interface AnnotationAPICreateModelAttrs {
  url: string;
  range: RangeAPIModel;
  ppCategory: AnnotationPPCategories;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export interface RangeAPIModel {
  start: string;
  startOffset: number;
  end: string;
  endOffset: number;
}

export enum AnnotationPPCategories {
  ADDITIONAL_INFO = 'ADDITIONAL_INFO',
  CLARIFICATION = 'CLARIFICATION',
  ERROR = 'ERROR',
}

export enum AnnotationDemagogCategories {
  TRUE = 'TRUE',
  PTRUE = 'PTRUE',
  FALSE = 'FALSE',
  PFALSE = 'PFALSE',
  LIE = 'LIE',
  UNKNOWN = 'UNKNOWN',
}

export enum AnnotationPriorities {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  ALERT = 'ALERT',
}

export const annotationPPCategoriesLabels = {
  ADDITIONAL_INFO: 'dodatkowa informacja',
  CLARIFICATION: 'doprecyzowanie',
  ERROR: 'sprostowanie błędu',
};
