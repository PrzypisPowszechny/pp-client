export default interface IAnnotation {
  fields: IAnnotationFields
}

export interface IAnnotationFields {
  annotationPriority: number;
  comment: string;
  link: string;
  linkTitle: string;
  isLinkOnly: boolean;
}
