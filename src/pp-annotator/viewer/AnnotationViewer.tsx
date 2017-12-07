import React from 'react';
import { AnnotationViewModel } from '../annotation';

interface IAnnotatorViewerProps {
  key: number;
  annotation: AnnotationViewModel;
  callbacks: ICallbacks;
}

interface IAnnotatorViewerState {
  initialView: boolean;
}

export interface ICallbacks {
  onEdit(e: React.MouseEvent<HTMLButtonElement>, annotation: AnnotationViewModel): void;
  onDelete(e: React.MouseEvent<HTMLButtonElement>, annotation: AnnotationViewModel): void;
}

export default class AnnotationViewer extends React.Component<IAnnotatorViewerProps, IAnnotatorViewerState> {
  constructor(props: IAnnotatorViewerProps) {
    super(props);

    this.state = {
      initialView: true,
      // TODO KG use also component's state to keep feedback buttons expansion state?
    };
  }

  componentWillReceiveProps() {
    // Set timeout after which edit buttons disappear
    this.setState({ initialView: true });
    setTimeout(() => this.setState({ initialView: false }), 500);
  }

  handleOnEdit = (e: any) => {
    return this.props.callbacks.onEdit(e, this.props.annotation);
  }

  handleOnDelete = (e: any) => {
    return this.props.callbacks.onDelete(e, this.props.annotation);
  }

  render() {
    const {
      priority,
      comment,
      referenceLink,
      referenceLinkTitle,
    } = this.props.annotation;

    return (
      // Analogous to annotator.Viewer.itemTemplate
      <li className="annotator-annotation annotator-item">
        <span
          className={'annotator-controls ' + (this.state.initialView ? 'annotator-visible' : '')}
        >
          <button
            type="button"
            title="Edit"
            className="annotator-edit"
            onClick={this.handleOnEdit}
          >
            Edit
          </button>
          <button
            type="button"
            title="Delete"
            className="annotator-delete"
            onClick={this.handleOnDelete}
          >
            Delete
          </button>
        </span>
        <div>{priority}</div>
        <div>{comment}</div>
        <div>{referenceLink}</div>
        <div>{referenceLinkTitle}</div>
      </li>
    );
  }
}
