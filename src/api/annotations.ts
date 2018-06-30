import { APICreateModel, APIModel, Relation } from './json-api';

export const AnnotationResourceType = 'annotations';

export abstract class AnnotationAPIModel extends APIModel {
  attributes: AnnotationAPIModelAttrs;
  relationships: {
    annotationUpvote: Relation;
  };
}

export abstract class AnnotationAPICreateModel extends APICreateModel {
  attributes: AnnotationAPICreateModelAttrs;
}

export abstract class AnnotationAPIModelAttrs {
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

export abstract class AnnotationAPICreateModelAttrs {
  url: string;
  range: RangeAPIModel;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export abstract class RangeAPIModel {
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
