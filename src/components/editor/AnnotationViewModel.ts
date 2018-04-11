import annotator from 'annotator';
import {AnnotationPriorities} from '../consts';
import {IAnnotationForm} from './annotation';

export default class AnnotationViewModel implements IAnnotationForm, annotator.IAnnotation {

  id: number;
  quote: string;
  ranges: any[]; // TODO type this better
  url: string;
  createDate: Date | null;
  doesBelongToUser: boolean;

  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;

  // Fields viewed / modified by the user
  objection: boolean;
  objectionCount: number;
  useful: boolean;
  usefulCount: number;
}
