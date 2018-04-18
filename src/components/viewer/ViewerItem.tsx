import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { Popup, Modal, Button } from 'semantic-ui-react';

import AnnotationViewModel from 'models/AnnotationViewModel';

import { AnnotationPriorities, annotationPrioritiesLabels } from '../consts';
import styles from './Viewer.scss';

interface IViewerItemProps {
  key: number;
  annotation: AnnotationViewModel;
}

interface IViewerItemState {
  initialView: boolean;
  useful: boolean;
  objection: boolean;
  confirmDeleteModalOpen: boolean;
}

export default class ViewerItem extends React.Component<IViewerItemProps, Partial<IViewerItemState>> {

  static editControlDisappearTimeout = 500;

  constructor(props: IViewerItemProps) {
    super(props);

    // TODO move useful/objection from this component's state to global state
    this.state = {
      initialView: true,
      useful: this.props.annotation.useful,
      objection: this.props.annotation.objection,
      confirmDeleteModalOpen: false,
    };
    this.setControlDisappearTimeout();
  }

  componentWillReceiveProps() {
    // Set timeout after which edit buttons disappear
    this.setState({ initialView: true });
    this.setControlDisappearTimeout();
  }

  setControlDisappearTimeout() {
    setTimeout(
      () => this.setState({ initialView: false }),
      ViewerItem.editControlDisappearTimeout,
    );
  }

  handleEdit = (e) => {
    // TODO
    console.log('edit');
    console.log(this.props.annotation);
  }

  setDeleteModalOpen = e => this.setState({ confirmDeleteModalOpen: true });

  setDeleteModalClosed = e => this.setState({ confirmDeleteModalOpen: false });

  handleDelete = (e) => {
    this.setState({ confirmDeleteModalOpen: false });
    // TODO
    console.log('delete');
    console.log(this.props.annotation);
  }

  toggleUseful = (e) => {
    // TODO
    this.setState({ useful: !this.state.useful });
  }

  // NOTE: objection will be removed in this version, stays here only so as not to disrupt the current codebase
  toggleObjection = (e) => {
    // TODO
    this.setState({ objection: !this.state.objection });
  }

  headerPriorityClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: styles.priorityNormal,
      [AnnotationPriorities.WARNING]: styles.priorityWarning,
      [AnnotationPriorities.ALERT]: styles.priorityAlert,
    };
    return priorityToClass[this.props.annotation.priority];
  }

  usefulButton() {
    const { usefulCount } = this.props.annotation;
    const { useful } = this.state;

    console.log(useful);
    console.log(usefulCount);

    return (
      <a
        className={classNames('ui', 'label', 'medium', styles.useful, { [styles.selected]: useful })}
        onClick={this.toggleUseful}
      >
        Przydatne
        <span className={styles.number}>{usefulCount + (useful ? 1 : 0)}</span>
      </a>
    );
  }

  // NOTE: objection will be removed in this version, stays here only so as not to disrupt the current codebase
  objectionButton() {
    const { objectionCount } = this.props.annotation;
    const { objection } = this.state;

    return (
      <a
        className={classNames('ui', 'label', 'medium', styles.objection, { [styles.selected]: objection })}
        onClick={this.toggleObjection}
      >
        Sprzeciw
        <span className={styles.number}>{objectionCount + (objection ? 1 : 0)}</span>
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
        <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
          {this.renderDeleteModal()}
          <button
            type="button"
            title="Edit"
            onClick={this.handleEdit}
          >
            <i className="edit icon" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={this.setDeleteModalOpen}
          >
            <i className="trash icon" />
          </button>
        </div>
      );
    } else {
      return null;
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
      <li className={styles.annotation}>
        <div className={styles.headBar}>
          <div className={classNames(styles.commentPriority, this.headerPriorityClass())}>
            {annotationPrioritiesLabels[priority]}
          </div>

          <div className={styles.commentDate}>
            {createDate ? moment(createDate).fromNow() : ''}
          </div>
          {this.renderControls()}
        </div>
        <div className={styles.comment}>
          {comment}
        </div>
        <div className={styles.bottomBar}>
          <div className={styles.referenceLinkContainer}>
            <a className={styles.referenceLink} href={referenceLink} target="_blank">
              {referenceLinkTitle}
            </a>
          </div>
          <div className={styles.ratings}>
            <Popup
              trigger={this.usefulButton()}
              size="small"
              className="pp-ui pp-popup-small-padding"
              inverted={true}
            >
              Daj znać, że uważasz przypis za pomocny.
            </Popup>
            <Popup
              trigger={this.objectionButton()}
              size="small"
              className="pp-ui pp-popup-small-padding"
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
