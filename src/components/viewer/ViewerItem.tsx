import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import moment from 'moment';
import { Popup } from 'semantic-ui-react';

import styles from './Viewer.scss';
import { hideViewer } from 'store/widgets/actions';
import {
  AnnotationResourceType, AnnotationAPIModel,
  AnnotationPriorities, annotationPrioritiesLabels,
} from 'api/annotations';
import {
  AnnotationUpvoteResourceType, AnnotationUpvoteAPIModel, AnnotationUpvoteAPICreateModel,
} from 'api/annotation-upvotes';
import { PPScopeClass } from '../../class_consts';
import { extractHostname, httpPrefixed } from '../../utils/url';
import ViewerItemControls from './ViewerItemControls';

interface IViewerItemProps {
  key: string;
  annotationId: string;
  indirectChildClassName: string;

  annotation: AnnotationAPIModel;
  isReportEditorOpen: boolean;

  hideViewer: () => undefined;
  deleteUpvote: (instance: AnnotationUpvoteAPIModel) => Promise<object>;
  createUpvote: (instance: AnnotationUpvoteAPICreateModel) => Promise<object>;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
}

@connect(
  (state, props) => {
    const viewerItem = state.widgets.viewer.viewerItems.find(item => item.annotationId === props.annotationId);
    const annotations = state.api.annotations.data;
    return {
      ...viewerItem,
      annotation: annotations.find(annotation => annotation.id === props.annotationId),
    };
  },
  dispatch => ({
    hideViewer: () => dispatch(hideViewer),
    deleteUpvote: (instance: AnnotationUpvoteAPIModel) => dispatch(deleteResource(instance)),
    createUpvote: (instance: AnnotationUpvoteAPICreateModel) => dispatch(createResource(instance)),
  }),
)
export default class ViewerItem extends React.Component<Partial<IViewerItemProps>, Partial<IViewerItemState>> {

  static defaultState = {};

  constructor(props: IViewerItemProps) {
    super(props);
    this.state = ViewerItem.defaultState;
  }

  toggleUpvote = (e) => {
    const { annotation } = this.props;
    if (annotation.relationships.annotationUpvote.data) {
      this.props.deleteUpvote({
        ...annotation.relationships.annotationUpvote.data,
        // Include relation to remove have the reverse relation (at annotation instance) removed as well,
        // even if this annotationUpvote is not in the store.
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

  handleAnnotationLinkClick = () => {
    this.props.hideViewer();
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
          [styles.selected]: Boolean(annotationUpvote.data),
        })
        }
        onClick={this.toggleUpvote}
      >
        <span className={styles.number}>{totalUpvoteCount}</span>
        <span className={styles.upvoteIcon}/>
      </a>
    );
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

          <ViewerItemControls annotation={this.props.annotation} />

        </div>
        {!comment ? '' :
          <div className={styles.comment}>
            {comment}
          </div>
        }
        <div className={styles.bottomBar}>
          <div className={styles.annotationLinkContainer}>
            <a
              className={styles.annotationLink}
              href={httpPrefixed(annotationLink)}
              onClick={this.handleAnnotationLinkClick}
              target="_blank"
            >
              <span className={styles.annotationLinkIcon}/>
              {extractHostname(annotationLink)}
            </a>
            <a
              className={styles.annotationLinkTitle}
              href={httpPrefixed(annotationLink)}
              onClick={this.handleAnnotationLinkClick}
              target="_blank"
            >
              {annotationLinkTitle}
            </a>
          </div>
          <div className={styles.ratings}>
            <Popup
              trigger={this.renderUpvoteButton()}
              size="small"
              className={classNames(indirectChildClassName, PPScopeClass, styles.popup, 'pp-popup-small-padding')}
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
