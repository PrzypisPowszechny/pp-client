import annotator from 'annotator';
import {AnnotationPriorities} from '../consts';

/*
 We extend annotator module's universal annotation format (both view model and transmission model)
 We aim to drop the dependency when we are ready, but now it's explicitly stated
  */
export interface IAnnotationInitialFields extends annotator.IAnnotation {
  url: string;
}

// Fields edited by the user in the form
export interface IAnnotationEditableFields {
  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;
}

// Annotation data sent to the server
export type IAnnotationForm = IAnnotationInitialFields & IAnnotationEditableFields;
