import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';

import { hideViewer } from 'content-scripts/store/widgets/actions';
import {
  AnnotationAPIModel, AnnotationPublishers,
  AnnotationPPCategories, AnnotationDemagogCategories,
  annotationPPCategoriesLabels, annotationDemagogCategoriesLabels,
} from 'common/api/annotations';
import { extractHostname, httpPrefixed } from '../../../common/url';

import AuthorActionControls from './viewer-elements/AuthorActionControls';
import UserActionControls from './viewer-elements/UserActionControls';
import ppGA from 'common/pp-ga';
import { selectAnnotation } from '../../store/api/selectors';

import styles from './Viewer.scss';
import { Icon } from 'react-icons-kit';
import { link } from 'react-icons-kit/icomoon/link';

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
      [AnnotationPPCategories.ADDITIONAL_INFO]: styles.categoryAdditionalInfo,
      [AnnotationPPCategories.CLARIFICATION]: styles.categoryClarification,
      [AnnotationPPCategories.ERROR]: styles.categoryError,
    };
    return ppCategoryToClass[this.props.annotation.attributes.ppCategory];
  }

  ppCategoryToClass(ppCategory) {
    const ppCategoryToClass = {
      [AnnotationPPCategories.ADDITIONAL_INFO]: styles.categoryAdditionalInfo,
      [AnnotationPPCategories.CLARIFICATION]: styles.categoryClarification,
      [AnnotationPPCategories.ERROR]: styles.categoryError,
    };
    return ppCategoryToClass[ppCategory];
  }

  demagogCategoryToClass(demagogCategory) {
    const ppCategoryToClass = {
      [AnnotationDemagogCategories.TRUE]: styles.dgCategoryTrue,
      [AnnotationDemagogCategories.PTRUE]: styles.dgCategoryTrue,
      [AnnotationDemagogCategories.FALSE]: styles.dgCategoryFalse,
      [AnnotationDemagogCategories.PFALSE]: styles.dgCategoryFalse,
      [AnnotationDemagogCategories.LIE]: styles.dgCategoryLie,
      [AnnotationDemagogCategories.UNKNOWN]: styles.dgCategoryUnknown,
    };
    return ppCategoryToClass[demagogCategory];
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
            <div className={classNames(styles.ppCategory, this.ppCategoryToClass(ppCategory))}>
              {comment ? annotationPPCategoriesLabels[ppCategory] : 'źródło'}
            </div>
            <div className={styles.commentDate}>
              {createDate ? moment(createDate).fromNow() : ''}
            </div>
          </div>
          <div className={styles.publisherInfo}>
            {publisher === AnnotationPublishers.DEMAGOG &&
            <a className={styles.publisherDemagog} href={'http://demagog.org.pl/'} target="_blank">
              <span className={styles.publisherName}>Dodane przez Demagoga</span>
              <span className={styles.publisherIcon} />
            </a>
            }
            {publisher === AnnotationPublishers.PP && doesBelongToUser &&
              <AuthorActionControls annotation={this.props.annotation} />
            }
          </div>
        </div>
        {!comment ? '' :
          <div className={styles.comment}>
            {publisher === AnnotationPublishers.DEMAGOG &&
              <span className={classNames(styles.demagogCategory, this.demagogCategoryToClass(demagogCategory))}>
                {annotationDemagogCategoriesLabels[demagogCategory]}
              </span>
              }
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
              {/* <span className={styles.annotationLinkIcon}/> */}
              <Icon className={styles.annotationLinkIcon} icon={link} size={11} />
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
