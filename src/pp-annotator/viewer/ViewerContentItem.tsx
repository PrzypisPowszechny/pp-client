import React from 'react';
import AnnotationViewModel from '../annotation/AnnotationViewModel';

interface IViewerContentItemProps {
  key: number;
  annotation: AnnotationViewModel;
  callbacks: ICallbacks;
}

interface IViewerContentItemState {
  initialView: boolean;
}

export interface ICallbacks {
  onEdit(e, annotation: AnnotationViewModel): void;
  onDelete(e, annotation: AnnotationViewModel): void;
}

export default class ViewerContentItem extends React.Component<IViewerContentItemProps,
  IViewerContentItemState> {
  constructor(props: IViewerContentItemProps) {
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

  handleEdit = e => this.props.callbacks.onEdit(e, this.props.annotation);

  handleDelete = e => this.props.callbacks.onDelete(e, this.props.annotation);

  render() {
    const {
      priority,
      comment,
      referenceLink,
      referenceLinkTitle,
      objectionCount,
      usefulCount,
    } = this.props.annotation;

    return (
      <li className="pp-annotation">
        <div className="pp-view-head-bar">
          <div className="pp-view-comment-priority">
            {priority}
          </div>

          <div className="pp-view-comment-date">
            01.01.1999
          </div>

          <div className={'pp-controls ' + (this.state.initialView ? 'pp-visible' : '')}>
            <button
              type="button"
              title="Edit"
              className="pp-edit"
              onClick={this.handleEdit}
            >
              <i className="edit icon"/>
            </button>
            <button
              type="button"
              title="Delete"
              className="pp-delete"
              onClick={this.handleDelete}
            >
              <i className="trash icon"/>
            </button>
          </div>
        </div>
        <div className="pp-view-comment">
          {comment}
        </div>
        <div className="pp-view-bottom-bar">
          <div className="pp-view-link-container">
            <a className="pp-view-link" href={referenceLink}>
              {referenceLinkTitle}
            </a>
          </div>
          <div className="pp-view-ratings">
            {/* todo probably termporary buttons*/}
            <a className="ui label medium">
              Przydatne
              {usefulCount}
            </a>
            <a className="ui label medium">
              Sprzeciw
              {objectionCount}
            </a>
          </div>
        </div>
      </li>
    );
  }
}
