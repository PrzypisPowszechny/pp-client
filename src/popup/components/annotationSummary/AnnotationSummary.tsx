import React from 'react';
import { AnnotationAPIModel, AnnotationPPCategories, } from 'common/api/annotations';
import _ from 'lodash';
import { Icon } from 'react-icons-kit';
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right';
import classNames from 'classnames';
import styles from './AnnotationSummary.scss';
import { connect } from 'react-redux';
import {
  PopupAnnotationLocationData,
  selectAnnotationLocations,
} from 'common/store/tabs/tab/annotations/selectors';

export interface IAnnotationSummaryProps {
  annotations: PopupAnnotationLocationData;

  onFullViewClick: (Event) => void;
}

// interface IAnnotationSummaryState {
// }

@connect(
  state => ({
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
      ..._.countBy(annotations.map(annotation => annotation.attributes.ppCategory)),
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
    // todo check site support
    if (false) {
      return (
        <div className={styles.self}>
          Na tej stronie nie ma przypisów.
        </div>
      );
    }
    if (!this.props.annotations.hasLoaded) {
      return (
        <div className={styles.self}>
          Ładuję przypisy...
        </div>);
    } else {
      const categoryCounts = this.categoryCounts();
      const allCount = _.sum(Object.keys(categoryCounts).map(category => categoryCounts[category]));
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
}
