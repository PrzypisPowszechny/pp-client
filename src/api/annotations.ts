import {AnnotationPriorities} from 'components/consts';

export interface RangeAPIModel {
  start: string;
  startOffset: number;
  end: string;
  endOffset: number;
}

export interface AnnotationAPICreateModel extends APICreateModel {
  attributes: AnnotationAPICreateModelAttrs;
}

export interface APICreateModel {
  id?: string;
  type: string;
}

export interface AnnotationAPICreateModelAttrs {
  url: string;
  range: RangeAPIModel;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export interface AnnotationAPIModel extends APIModel {
  attributes: AnnotationAPIModelAttrs;
  relationships: {
    annotationUpvote: Relation;
  };
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

export interface AnnotationUpvoteAPICreateModel extends APICreateModel {
  relationships: {
    annotation: CreateRelation;
  };
}

export interface AnnotationUpvoteAPIModel extends APIModel {
  relationships: {
    annotation: Relation;
  };
}

export interface Relation {
  link?: string;
  data: APIModel | null;
}

export interface CreateRelation {
  data: APIModel | null;
}

export interface Relations {
  link: string;
  data: APIModel[];
}

export interface APIModel {
  id: string;
  type: string;
}

export const AnnotationType = 'annotations';
export const AnnotationUpvoteType = 'annotationUpvotes';
