import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';

import styles from './Viewer.scss';
import { hideViewer } from 'store/widgets/actions';
import {
  AnnotationAPIModel,
  AnnotationPPCategories, annotationPPCategoriesLabels,
} from 'api/annotations';
import { extractHostname, httpPrefixed } from '../../utils/url';

import AuthorActionControls from './viewer-elements/AuthorActionControls';
import UserActionControls from './viewer-elements/UserActionControls';
import ppGA from '../../pp-ga';
import { selectAnnotation } from '../../store/api/selectors';

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
  (state, props) => ({
    annotation: selectAnnotation(state, props.annotationId),
  }), {
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
    const { ppCategory, comment, annotationLink } = this.props.annotation.attributes;
    ppGA.annotationDisplayed(this.props.annotationId, ppCategory, !comment, annotationLink);
  }

  handleAnnotationLinkClick = () => {
    const { ppCategory, comment, annotationLink } = this.props.annotation.attributes;
    this.props.hideViewer();
    ppGA.annotationLinkClicked(this.props.annotationId, ppCategory, !comment, annotationLink);
  }

  headerPPCategoryClass() {
    const ppCategoryToClass = {
      [AnnotationPPCategories.ADDITIONAL_INFO]: styles.priorityNormal,
      [AnnotationPPCategories.CLARIFICATION]: styles.priorityWarning,
      [AnnotationPPCategories.ERROR]: styles.priorityAlert,
    };
    return ppCategoryToClass[this.props.annotation.attributes.ppCategory];
  }

  render() {
    const {
      comment,
      annotationLink,
      annotationLinkTitle,
      createDate,
      ppCategory,
      demagogCategory,
      doesBelongToUser,
      publisher,
    } = this.props.annotation.attributes;

    return (
      <li className={styles.annotation}>
        <div className={styles.headBar}>
          <div>
            <div className={classNames(styles.commentPriority, this.headerPPCategoryClass())}>
              {comment ? annotationPPCategoriesLabels[ppCategory] : 'źródło'}
            </div>
            <div className={styles.commentDate}>
              {createDate ? moment(createDate).fromNow() : ''}
            </div>
          </div>
          <div className={styles.publisherInfo}>
            {publisher === 'DEMAGOG' &&
            <a className={styles.publisherDemagog} href={'http://demagog.org.pl/'} target="_blank">
              <span className={styles.publisherName}>Dodane przez Demagoga</span>
              <span className={styles.publisherIcon} />
            </a>
            }
            {publisher === 'PP' && doesBelongToUser &&
              <AuthorActionControls annotation={this.props.annotation} />
            }
          </div>
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
          <UserActionControls 
            annotation={this.props.annotation}
            indirectChildClassName={this.props.indirectChildClassName}
          />
        </div>
      </li>
    );
  }
}
