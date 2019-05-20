import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right';
import { connect } from 'react-redux';

import classNames from 'classnames';
import _countBy from 'lodash/countBy';
import _sum from 'lodash/sum';

import { AnnotationAPIModel, AnnotationPPCategories } from 'common/api/annotations';
import { selectTab } from 'common/store/tabs/selectors';
import { PopupAnnotationLocationData, selectAnnotationLocations } from 'common/store/tabs/tab/annotations/selectors';
import { ITabInfoState } from 'common/store/tabs/tab/tabInfo';

import styles from './AnnotationSummary.scss';

export interface IAnnotationSummaryProps {
  tabInfo: ITabInfoState;
  annotations: PopupAnnotationLocationData;

  onFullViewClick: (Event) => void;
}

// interface IAnnotationSummaryState {
// }

@connect(
  state => ({
    tabInfo: selectTab(state).tabInfo,
    annotations: selectAnnotationLocations(state),
  }),
)
export default class AnnotationSummary extends React.Component<Partial<IAnnotationSummaryProps>,
  {}> {
  constructor(props) {
    super(props);
  }

  categoryCounts() {
    const { located, unlocated } = this.props.annotations;
    const annotations: AnnotationAPIModel[] = located.concat(unlocated);
    return {
      [AnnotationPPCategories.ADDITIONAL_INFO]: 0,
      [AnnotationPPCategories.CLARIFICATION]: 0,
      [AnnotationPPCategories.ERROR]: 0,
      ..._countBy(annotations.map(annotation => annotation.attributes.ppCategory)),
    };
  }

  renderSummary(categoryCounts) {
    return (
      <div className={styles.summaryContainer}>
        <span className={styles.header}>Przypisy na tej stronie</span>
        <ul className={styles.summaryList}>
          {
            categoryCounts[AnnotationPPCategories.ADDITIONAL_INFO] > 0 &&
            <li className={classNames(styles.summaryItem, styles.additionalInfo)}>
              <div className={styles.marker}/>
              {categoryCounts[AnnotationPPCategories.ADDITIONAL_INFO]}
            </li>
          }
          {
            categoryCounts[AnnotationPPCategories.CLARIFICATION] > 0 &&
            <li className={classNames(styles.summaryItem, styles.clarification)}>
              <div className={styles.marker}/>
              {categoryCounts[AnnotationPPCategories.CLARIFICATION]}
            </li>
          }
          {
            categoryCounts[AnnotationPPCategories.ERROR] > 0 &&
            <li className={classNames(styles.summaryItem, styles.error)}>
              <div className={styles.marker}/>
              {categoryCounts[AnnotationPPCategories.ERROR]}
            </li>
          }
        </ul>
      </div>

    );
  }

  render() {
    const {
      isSupported,
      notSupportedMessage,
      contentScriptLoaded,
      contentScriptWontLoad,
    } = this.props.tabInfo;

    let message;
    if (isSupported !== null && !isSupported) {
      message = notSupportedMessage;
    } else if (contentScriptWontLoad) {
      message = 'Nie można dodawać przypisów na tej stronie lub pojawił się błąd. ' +
        'Jeśli uważasz, że PP powinien obsługiwać tę stronę, daj nam znać!';
    } else if (!contentScriptLoaded) {
      message = 'Łączę się ze stroną...';
    } else if (!this.props.annotations.hasLoaded) {
      message = 'Ładuję przypisy...';
    }
    if (message) {
      return (
        <div className={styles.self}>
          {message}
        </div>
      );
    }

    const categoryCounts = this.categoryCounts();
    const allCount = _sum(Object.keys(categoryCounts).map(category => categoryCounts[category]));
    if (allCount > 0) {
      return (
        <div className={classNames(styles.self, styles.anyFound)} onClick={this.props.onFullViewClick}>
          {this.renderSummary(categoryCounts)}
          <div className={styles.chevronButton}>
            <Icon icon={ic_chevron_right} size={25}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.self}>
          Brak przypisów na stronie
        </div>
      );

    }
  }
}
