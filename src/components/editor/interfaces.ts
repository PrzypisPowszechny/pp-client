import {AnnotationPriorities} from '../consts';
import {Range} from 'xpath-range';
import {AnnotationAPICreateModel} from 'api/annotations';

export interface IEditorForm {
  annotationId: number;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
}

export interface IEditorProps extends IEditorForm {
  visible: boolean;
  locationX: number;
  locationY: number;
  range: Range.SerializedRange;

  createAnnotation: (model: AnnotationAPICreateModel) => Promise<object>;
  hideEditor: () => void;
}

export interface IEditorState extends IEditorForm {
  locationX: number;
  locationY: number;
  moved: boolean;

  noCommentModalOpen: boolean;

  annotationLinkError: string;
  annotationLinkTitleError: string;
}
