import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';
import {
  AnnotationAPIModel,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import _ from 'lodash';
import { Icon } from 'react-icons-kit';
import { ic_chevron_right } from 'react-icons-kit/md/ic_chevron_right';
import classNames from 'classnames';
import styles from './AnnotationSummary.scss';

export interface IAnnotationSummaryProps {
  onFullViewClick: (Event) => void;
}

interface IAnnotationSummaryState {
  isLoading: boolean;
  willNotLoad: boolean;
  annotationLocationData: PopupAnnotationLocationData;
}

export default class AnnotationSummary extends React.Component<Partial<IAnnotationSummaryProps>,
  Partial<IAnnotationSummaryState>> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      willNotLoad: false,
    };
  }

  componentDidMount() {
    loadAnnotationLocationData().then((data) => {
      this.setState({
        annotationLocationData: data,
        isLoading: false,
      });
    }).catch(() => {
      this.setState({
        willNotLoad: true,
      });
    });
  }

  categoryCounts() {
    const annotations: AnnotationAPIModel[] = this.state.annotationLocationData.located;
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
    if (this.state.willNotLoad) {
      return (
        <div className={styles.self}>
          Na tej stronie nie ma przypisów.
        </div>
      );
    }
    if (this.state.isLoading) {
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
