import {AnnotationPriorities} from 'components/consts';

export interface RangeAPIModel {
  start: string;
  startOffset: number;
  end: string;
  endOffset: number;
}

export interface AnnotationAPICreateModel {
  id?: string;
  type: string;
  attributes: AnnotationAPICreateModelAttrs;
}

export interface AnnotationAPICreateModelAttrs {
  url: string;
  range: RangeAPIModel;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export interface AnnotationAPIModel {
  id: string;
  type: string;
  attributes: AnnotationAPIModelAttrs;
}

export interface AnnotationAPIModelAttrs {
  url: string;
  range: RangeAPIModel;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  upvote: boolean;
  upvoteCount: number;
  doesBelongToUser: boolean;
}
