// Because of redux-json-api constraints these types, have to be consistent with relationships names
export {
  AnnotationResourceType,
  AnnotationAPIModel,
  AnnotationAPICreateModel,
  AnnotationAPIModelAttrs,
  AnnotationPriorities,
  annotationPrioritiesLabels,
} from './annotations';
export {
  AnnotationReportResourceType,
  AnnotationReportAPIModel,
  AnnotationReportAPICreateModel,
  Reasons,
} from './annotation-reports';
export {
  AnnotationUpvoteResourceType,
  AnnotationUpvoteAPIModel,
  AnnotationUpvoteAPICreateModel,
} from './annotation-upvotes';
