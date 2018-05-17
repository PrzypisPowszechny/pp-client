import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import moment from 'moment';
import { Popup, Modal, Button } from 'semantic-ui-react';

import { AnnotationPriorities, annotationPrioritiesLabels } from '../consts';
import styles from './Viewer.scss';
import {hideViewer, setSelectionRange, showEditorAnnotation} from 'store/widgets/actions';
import {selectViewerState} from 'store/widgets/selectors';
import {Range} from 'xpath-range';
import {
  AnnotationAPIModel, AnnotationType, AnnotationUpvoteAPICreateModel, AnnotationUpvoteAPIModel,
  AnnotationUpvoteType,
} from '../../api/annotations';

interface IViewerItemProps {
  key: string;
  annotation: AnnotationAPIModel;

  deleteUpvote: (instance: AnnotationUpvoteAPIModel) => Promise<object>;
  createUpvote: (instance: AnnotationUpvoteAPICreateModel) => Promise<object>;

  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  confirmDeleteModalOpen: boolean;
}

@connect(
  null,
  dispatch => ({
    showEditorAnnotation: () => dispatch(showEditorAnnotation),
    hideViewer: () => dispatch(hideViewer),

    deleteUpvote: (instance: AnnotationUpvoteAPIModel) => dispatch(deleteResource(instance)),
    createUpvote: (instance: AnnotationUpvoteAPICreateModel) => dispatch(createResource(instance)),
  }),
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
  onEditClick = (e) => {
    // this.props.onEdit(this.props.annotationId);
  }

  onDeleteClick = (e) => {
    // this.props.onDelete(this.props.annotationId);
  }

  setDeleteModalOpen = e => this.setState({ confirmDeleteModalOpen: true });

  setDeleteModalClosed = e => this.setState({ confirmDeleteModalOpen: false });

  toggleUpvote = (e) => {
    const { annotation } = this.props;
    if (annotation.relationships.annotationUpvote.data) {
      this.props.deleteUpvote({
        ...annotation.relationships.annotationUpvote.data,
        // Include relation to remove have the reverse relation (at annotation instance) removed as well,
        // even if this annotationUpvote is not in the store.
        relationships: {
          annotation: {
            data: {id: annotation.id, type: annotation.type},
          },
        },
      })
        .then(() => null)
        .catch((errors) => {
          console.log(errors);
        });
    } else {
      this.props.createUpvote({
        type: AnnotationUpvoteType,
        relationships: {
          annotation: {
            data: {
              id: annotation.id,
              type: AnnotationType,
            },
          },
        },
      }).then(() => null)
      .catch((errors) => {
        console.log(errors);
      });
    }
  }

  headerPriorityClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: styles.priorityNormal,
      [AnnotationPriorities.WARNING]: styles.priorityWarning,
      [AnnotationPriorities.ALERT]: styles.priorityAlert,
    };
    return priorityToClass[this.props.annotation.attributes.priority];
  }

  upvoteButton() {
    const { annotation } = this.props;
    const { annotationUpvote } = annotation.relationships;
    const totalUpvoteCount = annotation.attributes.upvoteCountExceptUser + (annotationUpvote.data ? 1 : 0);
    return (
      <a
        className={classNames('ui', 'label', 'medium', styles.upvote, {
          [styles.selected]: Boolean(annotationUpvote.data) })
        }
        onClick={this.toggleUpvote}
      >
        Przydatne
        <span className={styles.number}>{totalUpvoteCount}</span>
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
          <Button onClick={this.onDeleteClick} size="tiny" positive={true}>
            Tak
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderControls() {
    if (this.props.annotation.attributes.doesBelongToUser) {
      return (
        <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
          {this.renderDeleteModal()}
          <button
            type="button"
            title="Edit"
            onClick={this.onEditClick}
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
    } = this.props.annotation.attributes;

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
