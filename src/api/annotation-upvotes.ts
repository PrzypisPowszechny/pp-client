import { APICreateModel, APIModel, CreateRelation, Relation } from './json-api';

export const AnnotationUpvoteResourceType = 'annotationUpvotes';

export interface AnnotationUpvoteAPIModel extends APIModel {
  relationships: {
    annotation: Relation;
  };
}

export interface AnnotationUpvoteAPICreateModel extends APICreateModel {
  relationships: {
    annotation: CreateRelation;
  };
}
