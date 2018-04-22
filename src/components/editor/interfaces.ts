import {AnnotationPriorities} from '../consts';
import {Range} from 'xpath-range';

export interface IEditorForm {
  annotationId: number;
  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;
}

export interface IEditorProps extends IEditorForm {
  visible: boolean;
  locationX: number;
  locationY: number;
  range: Range.SerializedRange;

  createAnnotation: (form: IEditorForm, range: Range.SerializedRange) => void;
  hideEditor: () => void;
}

export interface IEditorState extends IEditorForm {
  locationX: number;
  locationY: number;
  moved: boolean;

  noCommentModalOpen: boolean;

  referenceLinkError: string;
  referenceLinkTitleError: string;
}
