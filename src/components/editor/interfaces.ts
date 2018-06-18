import { AnnotationPriorities } from '../consts';
import { AnnotationAPICreateModel, AnnotationAPIModel } from 'api/annotations';
import { IEditorRange } from 'store/widgets/reducers';

export interface IEditorProps {
  locationX: number;
  locationY: number;

  annotation: AnnotationAPIModel;
  range: IEditorRange;

  createAnnotation: (instance: AnnotationAPICreateModel) => Promise<object>;
  hideEditor: () => void;
}

export interface IEditorState {
  annotationId: string;
  priority: AnnotationPriorities;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  range: IEditorRange;

  locationX: number;
  locationY: number;
  moved: boolean;

  noCommentModalOpen: boolean;

  commentError: string;
  annotationLinkError: string;
  annotationLinkTitleError: string;
}
