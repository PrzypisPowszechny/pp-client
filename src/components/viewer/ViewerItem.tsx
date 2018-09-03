import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './Viewer.scss';
import { hideViewer } from 'store/widgets/actions';
import {
  AnnotationAPIModel,
  AnnotationPriorities, annotationPrioritiesLabels,
} from 'api/annotations';
import { extractHostname, httpPrefixed } from '../../utils/url';
import ViewerItemControls from './ViewerItemControls';
import Upvote from './Upvote';
import ppGA from '../../pp-ga';

interface IViewerItemProps {
  key: string;
  annotationId: string;
  indirectChildClassName: string;

  annotation: AnnotationAPIModel;
  hideViewer: () => undefined;
}

interface IViewerItemState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
}

@connect(
  (state, props) => {
    const annotations = state.api.annotations.data;
    return {
      annotation: annotations.find(annotation => annotation.id === props.annotationId),
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

  componentDidMount() {
    const { priority, comment, annotationLink } = this.props.annotation.attributes;
    ppGA.annotationDisplayed(this.props.annotationId, priority, !comment, annotationLink);
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

  render() {
    const {
      priority,
      comment,
      annotationLink,
      annotationLinkTitle,
      createDate,
    } = this.props.annotation.attributes;

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
          <Upvote annotation={annotation} indirectChildClassName={indirectChildClassName} />
        </div>
      </li>
    );
  }

}
