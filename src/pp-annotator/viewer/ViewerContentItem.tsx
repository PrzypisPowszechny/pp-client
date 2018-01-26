import React from 'react';
import AnnotationViewModel from '../annotation/AnnotationViewModel';
import {AnnotationPriorities, annotationPrioritiesLabels} from '../consts';
import {Popup, Modal, Button} from 'semantic-ui-react';

interface IViewerContentItemProps {
  key: number;
  annotation: AnnotationViewModel;
  callbacks: ICallbacks;
}

interface IViewerContentItemState {
  initialView: boolean;
  useful: boolean;
  objection: boolean;
  confirmDeleteModalOpen: boolean;
}

export interface ICallbacks {
  onEdit(e, annotation: AnnotationViewModel): void;
  onDelete(e, annotation: AnnotationViewModel): void;
}

export default class ViewerContentItem extends React.Component<
  IViewerContentItemProps,
  Partial<IViewerContentItemState>
  > {

  constructor(props: IViewerContentItemProps) {
    super(props);

    this.state = {
      initialView: true,
      useful: this.props.annotation.useful,
      objection: this.props.annotation.objection,
      confirmDeleteModalOpen: false,
    };
  }

  componentWillReceiveProps() {
    // Set timeout after which edit buttons disappear
    this.setState({initialView: true});
    setTimeout(() => this.setState({initialView: false}), 500);
  }

  handleEdit = e => this.props.callbacks.onEdit(e, this.props.annotation);

  setDeleteModalOpen = e => this.setState({confirmDeleteModalOpen: true});

  setDeleteModalClosed = e => this.setState({confirmDeleteModalOpen: false});

  handleDelete = (e) => {
    this.setState({confirmDeleteModalOpen: false});
    this.props.callbacks.onDelete(e, this.props.annotation);
  }

  toggleUseful = e => this.setState({useful: !this.state.useful});

  toggleObjection = e => this.setState({objection: !this.state.objection});

  headerPriorityClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: 'priority-normal',
      [AnnotationPriorities.WARNING]: 'priority-warning',
      [AnnotationPriorities.ALERT]: 'priority-alert',
    };
    return priorityToClass[this.props.annotation.priority];
  }

  usefulButton() {
    const {usefulCount} = this.props.annotation;
    const {useful} = this.state;

    return (
      <a className={'ui label medium useful ' + (useful ? 'selected' : '')} onClick={this.toggleUseful}>
        Przydatne
        <span className="number">{usefulCount + (useful ? 1 : 0)}</span>
      </a>
    );
  }

  objectionButton() {
    const {objectionCount} = this.props.annotation;
    const {objection} = this.state;

    return (
      <a className={'ui label medium objection ' + (objection ? 'selected' : '')} onClick={this.toggleObjection}>
        Sprzeciw
        <span className="number">{objectionCount + (objection ? 1 : 0)}</span>
      </a>
    );
  }

  renderDeleteModal() {
    return (
      <Modal
        size="mini"
        className="pp-ui"
        open={this.state.confirmDeleteModalOpen}
      >
        <Modal.Content>
          <p>Czy na pewno chcesz usunąć przypis?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.setDeleteModalClosed} negative={true}>
            Nie
          </Button>
          <Button onClick={this.handleDelete} positive={true}>
            Tak
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const {
      priority,
      comment,
      referenceLink,
      referenceLinkTitle,
    } = this.props.annotation;

    return (
      <li className="pp-annotation">
        <div className="pp-view-head-bar">
          <div className={'pp-view-comment-priority ' + this.headerPriorityClass()}>
            {annotationPrioritiesLabels[priority]}
          </div>

          <div className="pp-view-comment-date">
            01.01.1999
          </div>

          <div className={'pp-controls ' + (this.state.initialView ? 'pp-visible' : '')}>
            {this.renderDeleteModal()}
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
              onClick={this.setDeleteModalOpen}
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
            <a className="pp-view-link" href={referenceLink} target="_blank">
              {referenceLinkTitle}
            </a>
          </div>
          <div className="pp-view-ratings">
            <Popup
              trigger={this.usefulButton()}
              size="small"
              className="pp-ui small-padding"
              inverted={true}
            >
              Daj znać, że uważasz przypis za pomocny.
            </Popup>
            <Popup
              trigger={this.objectionButton()}
              size="small"
              className="pp-ui small-padding"
              inverted={true}
            >
              Daj znać, jeśli uważasz, że przypis nie jest obiektywny.
            </Popup>
          </div>
        </div>
      </li>
    );
  }

}
