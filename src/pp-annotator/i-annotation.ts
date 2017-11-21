
import annotator from 'annotator';
import {AnnotationPriorities} from "./consts";

export interface IAnnotationBase extends annotator.IAnnotation {
  url?: string;
}

export interface IAnnotationFields {
  priority?: AnnotationPriorities;
  comment?: string;
  link?: string;
  linkTitle?: string;
}

type IAnnotation = IAnnotationBase & IAnnotationFields;

export default IAnnotation;