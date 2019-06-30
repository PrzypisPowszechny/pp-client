import { APICreateModel, APIModel, Relation } from './json-api';

export const AnnotationResourceType = 'annotations';

export interface AnnotationAPIModel extends APIModel {
  attributes: AnnotationAPIModelAttrs;
  relationships: {
    annotationUpvote: Relation;
    annotationRequest: Relation;
  };
}

export interface AnnotationAPIUpdateModel extends APIModel {
  attributes: Partial<AnnotationAPIModelUpdatableAttrs>;
}

export interface AnnotationAPICreateModel extends APICreateModel {
  attributes: AnnotationAPICreateModelAttrs;
  relationships: {
    annotationRequest: Relation;
  };
}

export interface AnnotationAPIModelUpdatableAttrs {
  ppCategory: AnnotationPPCategories;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export interface AnnotationAPIModelAttrs extends AnnotationAPIModelUpdatableAttrs {
  url: string;
  range: RangeAPIModel;
  quote: string;
  publisher: AnnotationPublishers;
  quoteContext: string;
  demagogCategory: AnnotationDemagogCategories;
  createDate?: Date;
  upvoteCountExceptUser: number;
  doesBelongToUser: boolean;
}

export interface AnnotationAPICreateModelAttrs extends AnnotationAPIModelUpdatableAttrs {
  url: string;
  quote: string;
  quoteContext?: string;
  range?: RangeAPIModel;
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

export const annotationPPCategoriesLabels = {
  ADDITIONAL_INFO: 'dodatkowa informacja',
  CLARIFICATION: 'doprecyzowanie',
  ERROR: 'sprostowanie błędu',
};

export const annotationDemagogCategoriesLabels = {
  TRUE: 'Prawda',
  PTRUE: 'Prawda',
  FALSE: 'Fałsz',
  PFALSE: 'Fałsz',
  LIE: 'Manipulacja',
  UNKNOWN: 'Nieweryfikowalne',
};

export enum AnnotationPublishers {
  PP = 'PP',
  DEMAGOG = 'DEMAGOG',
}
