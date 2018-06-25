import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';

import { AnnotationPriorities, annotationPrioritiesLabels } from '../consts';
import styles from './Viewer.scss';
import { hideViewer, showEditorAnnotation } from 'store/widgets/actions';

import {
  AnnotationAPIModel,
  AnnotationResourceType,
  AnnotationUpvoteAPICreateModel,
  AnnotationUpvoteAPIModel,
  AnnotationUpvoteResourceType,
} from '../../api/annotations';
import Timer = NodeJS.Timer;
import { PPScopeClass } from '../../class_consts';
import { extractHostname, httpPrefixed } from '../../utils/url';
import ReportEditor from './report-editor/ReportEditor';

interface IViewerItemProps {
  key: string;
  annotation: AnnotationAPIModel;
  indirectChildClassName: string;

  hideViewer: () => undefined;

  deleteUpvote: (instance: AnnotationUpvoteAPIModel) => Promise<object>;
  createUpvote: (instance: AnnotationUpvoteAPICreateModel) => Promise<object>;

  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  // TODO: move this field (and create reportEditorAnnotationId) to global store if only one editor shall be present
  reportEditorVisible: boolean;
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

  static defaultState = {
    reportEditorVisible: false,
  };

  static getDerivedStateFromProps() {
    return { initialView: true };
  }

  disappearTimeoutId: Timer;

  constructor(props: IViewerItemProps) {
    super(props);
    this.state = ViewerItem.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutId = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutId = null;
      },
      ViewerItem.editControlDisappearTimeout,
    );
  }

  componentWillUnmount() {
    if (this.disappearTimeoutId) {
      clearTimeout(this.disappearTimeoutId);
    }
  }

  onEditClick = (e) => {
    this.props.onEdit(this.props.annotation.id);
  }

  onDeleteClick = (e) => {
    this.props.onDelete(this.props.annotation.id);
  }

  toggleUpvote = (e) => {
    const { annotation } = this.props;
    if (annotation.relationships.annotationUpvote.data) {
      this.props.deleteUpvote({
        ...annotation.relationships.annotationUpvote.data,
        // Include relation to remove have the reverse relation (at annotation instance) removed as well,
        // even if this annotationUpvote is not in the store.
        relationships: {
          annotation: {
            data: { id: annotation.id, type: annotation.type },
          },
        },
      }).then(() => null)
      .catch((errors) => {
        console.log(errors);
      });
    } else {
      this.props.createUpvote({
        type: AnnotationUpvoteResourceType,
        relationships: {
          annotation: {
            data: {
              id: annotation.id,
              type: AnnotationResourceType,
            },
          },
        },
      }).then(() => null)
      .catch((errors) => {
        console.log(errors);
      });
    }
  }

  toggleReportEditor = (e?: any) => {
    this.setState({ reportEditorVisible: !this.state.reportEditorVisible });
  }

  headerPriorityClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: styles.priorityNormal,
      [AnnotationPriorities.WARNING]: styles.priorityWarning,
      [AnnotationPriorities.ALERT]: styles.priorityAlert,
    };
    return priorityToClass[this.props.annotation.attributes.priority];
  }

  renderUpvoteButton() {
    const { annotation } = this.props;
    const { annotationUpvote } = annotation.relationships;
    const totalUpvoteCount = annotation.attributes.upvoteCountExceptUser + (annotationUpvote.data ? 1 : 0);
    return (
      <a
        className={classNames('ui', styles.upvote, {
          [styles.selected]: Boolean(annotationUpvote.data) })
        }
        onClick={this.toggleUpvote}
      >
        <span className={styles.number}>{totalUpvoteCount}</span>
        <span className={styles.upvoteIcon} />
      </a>
    );
  }

  renderControls() {
    if (this.props.annotation.attributes.doesBelongToUser) {
      return (
        <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
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
            onClick={this.onDeleteClick}
          >
            <i className="trash icon" />
          </button>
        </div>
      );
    } else {
      return (
        <div className={classNames(styles.controls, styles.visible )}>
          <button
            type="button"
            title="Edit"
            onClick={this.toggleReportEditor}
          >
            <span className={classNames(styles.actionsIcon)} />
          </button>
        </div>
      );
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

    const {
      indirectChildClassName,
    } = this.props;

    return (
      <li className={styles.annotation}>
        <div className={styles.headBar}>
          <div className={classNames(styles.commentPriority, this.headerPriorityClass())}>
            {comment ? annotationPrioritiesLabels[priority] : 'źródło'}
          </div>

          <div className={styles.commentDate}>
            {createDate ? moment(createDate).fromNow() : ''}
          </div>
          {this.renderControls()}
        </div>
        {!comment ? '' :
          <div className={styles.comment}>
            {comment}
          </div>
        }
        <div className={styles.bottomBar}>
          <div className={styles.annotationLinkContainer}>
            <a className={styles.annotationLink} href={httpPrefixed(annotationLink)} target="_blank">
              <span className={styles.annotationLinkIcon} />
              {extractHostname(annotationLink)}
            </a>
            <a className={styles.annotationLinkTitle} href={httpPrefixed(annotationLink)} target="_blank">
              {annotationLinkTitle}
            </a>
          </div>
          <div className={styles.ratings}>
            <Popup
              trigger={this.renderUpvoteButton()}
              size="small"
              className={classNames(indirectChildClassName, PPScopeClass, 'pp-popup-small-padding')}
              inverted={true}
            >
              Daj znać, że uważasz przypis za pomocny.
            </Popup>
          </div>
        </div>
        {!this.state.reportEditorVisible ? null :
          <ReportEditor
            annotation={this.props.annotation}
            onCancel={this.toggleReportEditor}
            onSuccess={this.toggleReportEditor}
          />
        }
      </li>
    );
  }

}
