import { APICreateModel, APIModel, CreateRelation, Relation } from './json-api';

export const AnnotationUpvoteResourceType = 'annotationUpvotes';

export abstract class AnnotationUpvoteAPIModel extends APIModel {
  relationships: {
    annotation: Relation;
  };
}

export abstract class AnnotationUpvoteAPICreateModel extends APICreateModel {
  relationships: {
    annotation: CreateRelation;
  };
}
