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
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  upvoteCountExceptUser: number;
  doesBelongToUser: boolean;
  createDate?: Date;
}

export interface AnnotationAPICreateModelAttrs {
  url: string;
  range: RangeAPIModel;
  priority: AnnotationPriorities;
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

export enum AnnotationPriorities {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  ALERT = 'ALERT',
}

export const annotationPrioritiesLabels = {
  NORMAL: 'dodatkowa informacja',
  WARNING: 'doprecyzowanie',
  ALERT: 'sprostowanie błędu',
};
