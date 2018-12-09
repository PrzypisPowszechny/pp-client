
// Annotation request is not fully a JSON API model (it misses type id)
// (besides the missing "type" field the schema is compliant)

export interface AnnotationRequestAttributes {
  url: string;
  quote?: string;
}

export interface AnnotationRequestAPICreateModel {
  data: {
    attributes: AnnotationRequestAttributes;
  };
}
