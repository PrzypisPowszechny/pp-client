import React from 'react';
import AnnotationViewModel from '../annotation/AnnotationViewModel';
import {AnnotationPriorities, annotationPrioritiesLabels} from '../consts';
import {Popup, Modal, Button} from 'semantic-ui-react';
import moment from 'moment';

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

  // A persistence mockup, to be removed as soon as we use a real persistence layer
  toggleUseful = (e) => {
    this.props.annotation.useful = !this.props.annotation.useful;
    this.setState({useful: this.props.annotation.useful});
  }

  // A persistence mockup, to be removed as soon as we use a real persistence layer
  toggleObjection = (e) => {
    this.props.annotation.objection = !this.props.annotation.objection;
    this.setState({objection: this.props.annotation.objection});
  }

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
          <Button onClick={this.setDeleteModalClosed} size="tiny" negative={true}>
            Nie
          </Button>
          <Button onClick={this.handleDelete} size="tiny" positive={true}>
            Tak
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderControls() {
    if (this.props.annotation.doesBelongToUser) {
      return (
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
      );
    } else {
      return '';
    }
  }

  render() {
    const {
      priority,
      comment,
      referenceLink,
      referenceLinkTitle,
      createDate,
    } = this.props.annotation;

    // Set date language
    moment.locale('pl');

    return (
      <li className="pp-annotation">
        <div className="pp-view-head-bar">
          <div className={'pp-view-comment-priority ' + this.headerPriorityClass()}>
            {annotationPrioritiesLabels[priority]}
          </div>

          <div className="pp-view-comment-date">
            {createDate ? moment(createDate).fromNow() : ''}
          </div>
          {this.renderControls()}
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
