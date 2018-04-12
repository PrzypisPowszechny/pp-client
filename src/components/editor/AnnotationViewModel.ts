import {AnnotationPriorities} from '../consts';

// ViewModel ported from old_src
// TODO probably replace it with an api data model
export default class AnnotationViewModel {

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
