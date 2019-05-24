import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_chevron_left } from 'react-icons-kit/md/ic_chevron_left';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { AnnotationPPCategories } from 'common/api/annotations';
import ppGa from 'common/pp-ga';
import { PopupAnnotationLocationData, selectAnnotationLocations } from 'common/store/tabs/tab/annotations/selectors';
import { standardizeUrlForPageSettings } from 'common/url';

import styles from './AnnotationList.scss';

import { AnnotationsStage } from '../../../common/store/tabs/tab/annotations/types';
import { sendScrollToAnnotation } from '../../messages';
import { PopupPages } from '../BrowserPopupNavigator';

export interface IAnnotationListProps {
  annotations: PopupAnnotationLocationData;
  onPageChange: (Event) => void;
}

interface IAnnotationListState {
  isLoading: boolean;
  annotationLocationData: PopupAnnotationLocationData;
}

@connect(
  state => ({
    annotations: selectAnnotationLocations(state),
  }),
)
export default class AnnotationList extends React.Component<Partial<IAnnotationListProps>,
  Partial<IAnnotationListState>> {

  markerStyles = {
    [AnnotationPPCategories.ADDITIONAL_INFO]: styles.additionalInfo,
    [AnnotationPPCategories.CLARIFICATION]: styles.clarification,
    [AnnotationPPCategories.ERROR]: styles.error,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  handleGoBackClick = (e) => {
    this.props.onPageChange(PopupPages.main);
  }

  onAnnotationClick = (e) => {
    const { annotationId } = e.currentTarget.dataset;
    sendScrollToAnnotation(annotationId);

    // TODO: such tabs query already takes in BrowserPopup component, pass those data using store to be DRY
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      ppGa.annotationSummaryAnnotationClicked(annotationId, { location: standardizeUrlForPageSettings(tab.url) });
    });

  }

  render() {
    if (this.props.annotations.stage !== AnnotationsStage.located) {
      return (
        <div className={styles.self}>
          Ładuję...
        </div>
      );
    } else {
      return (
        <div className={styles.self}>
          <div className={styles.topBar}>
            <div onClick={this.handleGoBackClick}>
              <Icon className={styles.chevronButton} icon={ic_chevron_left} size={25}/>
            </div>
            <span className={styles.header}>Przypisy dodane na tej stronie</span>
          </div>
          <ul className={styles.annotationList}>
            {this.props.annotations.located.map(annotation => (
              <li
                className={styles.listItem}
                key={annotation.id}
                data-annotation-id={annotation.id}
                onClick={this.onAnnotationClick}
              >
                <div className={classNames(styles.marker, this.markerStyles[annotation.attributes.ppCategory])}/>
                <div className={styles.annotationTexts}>
                  <div className={styles.quote}>"{annotation.attributes.quote}"</div>
                  <div className={styles.comment}>{annotation.attributes.comment}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}
