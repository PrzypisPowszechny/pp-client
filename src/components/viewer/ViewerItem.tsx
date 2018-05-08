import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import { Popup, Modal, Button } from 'semantic-ui-react';


import { AnnotationPriorities, annotationPrioritiesLabels } from '../consts';
import styles from './Viewer.scss';
import {hideViewer} from 'store/widgets/actions';
import {selectViewerState} from 'store/widgets/selectors';

interface IViewerItemProps {
  key: string;

  doesBelongToUser: boolean;
  priority: AnnotationPriorities;
  upvote: boolean;
  upvoteCount: number;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  createDate: any;

  hideViewer: () => void;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  confirmDeleteModalOpen: boolean;
}

@connect(
  null, {
    hideViewer,
  },
)
export default class ViewerItem extends React.Component<Partial<IViewerItemProps>, Partial<IViewerItemState>> {

  static editControlDisappearTimeout = 500;

  constructor(props: IViewerItemProps) {
    super(props);
    this.state = {
      initialView: true,
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
    this.props.hideViewer();
    // [roadmap 6.4.1.3] TODO on "edit" open the Editor for edit.
    console.log('Editor should open now with the form filled in; not implemented yet!');
  }

  setDeleteModalOpen = e => this.setState({ confirmDeleteModalOpen: true });

  setDeleteModalClosed = e => this.setState({ confirmDeleteModalOpen: false });

  handleDelete = (e) => {
    this.props.hideViewer();
    // [roadmap 5.3] TODO connect handleDelete to redux-json-api call
    console.log('Annotations should be deleted now; not implemented yet!');
  }

  toggleUpvote = (e) => {
    // [roadmap 5.3] TODO connect toggleUpvote to redux-json-api call
  }

  headerPriorityClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: styles.priorityNormal,
      [AnnotationPriorities.WARNING]: styles.priorityWarning,
      [AnnotationPriorities.ALERT]: styles.priorityAlert,
    };
    return priorityToClass[this.props.priority];
  }

  upvoteButton() {
    return (
      <a
        className={classNames('ui', 'label', 'medium', styles.upvote, { [styles.selected]: this.props.upvote })}
        onClick={this.toggleUpvote}
      >
        Przydatne
        <span className={styles.number}>{this.props.upvoteCount}</span>
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
    if (this.props.doesBelongToUser) {
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
      annotationLink,
      annotationLinkTitle,
      createDate,
    } = this.props;

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
          <div className={styles.annotationLinkContainer}>
            <a className={styles.annotationLink} href={annotationLink} target="_blank">
              {annotationLinkTitle}
            </a>
          </div>
          <div className={styles.ratings}>
            <Popup
              trigger={this.upvoteButton()}
              size="small"
              className="pp-ui pp-popup-small-padding"
              inverted={true}
            >
              Daj znać, że uważasz przypis za pomocny.
            </Popup>
          </div>
        </div>
      </li>
    );
  }

}
