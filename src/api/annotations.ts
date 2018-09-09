import { APICreateModel, APIModel, Relation } from './json-api';
import { DemagogAnnotationCategories } from './demagog-annotations';

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

export interface AnnotationViewModel {
  // ID unique over annotations and Demagog annotations
  id: string;
  provider: AnnotationProvider;
  // URL where the annotation came from
  url?: string;
  range: RangeAPIModel;
  priority?: AnnotationPriorities;
  demagogCategory?: DemagogAnnotationCategories;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  upvoteCountExceptUser: number;
  doesBelongToUser: boolean;
  createDate?: Date;
}

export enum AnnotationProvider {
  USER = 'USER',
  DEMAGOG = 'DEMAGOG',
}
