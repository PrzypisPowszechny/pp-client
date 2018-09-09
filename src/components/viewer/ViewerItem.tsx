import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './Viewer.scss';
import { hideViewer } from 'store/widgets/actions';
import {
  AnnotationAPIModel,
  AnnotationPriorities, annotationPrioritiesLabels, AnnotationProvider, AnnotationViewModel,
} from 'api/annotations';
import { extractHostname, httpPrefixed } from '../../utils/url';
import ViewerItemControls from './ViewerItemControls';
import Upvote from './Upvote';
import { selectAnnotation } from '../../store/widgets/selectors';

interface IViewerItemProps {
  key: string;
  annotationId: string;
  indirectChildClassName: string;

  annotation: AnnotationViewModel;
  hideViewer: () => undefined;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
}

@connect(
  (state, props) => {
    const annotations = state.api.annotations.data;
    return {
      annotation: selectAnnotation(state, props.annotationId),
    };
  }, {
    hideViewer,
  },
)
export default class ViewerItem extends React.Component<Partial<IViewerItemProps>, Partial<IViewerItemState>> {

  static defaultState = {};

  constructor(props: IViewerItemProps) {
    super(props);
    this.state = ViewerItem.defaultState;
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
    return priorityToClass[this.props.annotation.priority];
  }

  render() {
    const {
      priority,
      comment,
      annotationLink,
      annotationLinkTitle,
      createDate,
      provider,
    } = this.props.annotation;

    const {
      annotation,
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
          {provider === AnnotationProvider.USER &&
            <ViewerItemControls annotationId={this.props.annotation.id}/>
          }

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
          {/* TODO Upvotes are not implemented for Demagog annotations yet;
            the code assumes user annotation for now so it would throw errors*/}
          {provider === AnnotationProvider.USER &&
            <Upvote annotationId={annotation.id} indirectChildClassName={indirectChildClassName}/>
          }
          </div>
      </li>
    );

  }
}
