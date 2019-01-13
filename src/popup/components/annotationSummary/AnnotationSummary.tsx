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

  renderSummary() {
    const annotations: AnnotationAPIModel[] = this.state.annotationLocationData.located;
    const counts = {
      [AnnotationPPCategories.ADDITIONAL_INFO]: 0,
      [AnnotationPPCategories.CLARIFICATION]: 0,
      [AnnotationPPCategories.ERROR]: 0,
      ..._.countBy(annotations.map(annotation => annotation.attributes.ppCategory)),
    };
    // TODO ignore annotations with zero count
    // TODO style
    return (
      <ul className={styles.summaryList}>
        <li className={classNames(styles.summaryItem, styles.additionalInfo)}>
          <div className={styles.marker} />
          {counts[AnnotationPPCategories.ADDITIONAL_INFO]}
        </li>
        <li className={classNames(styles.summaryItem, styles.clarification)}>
          <div className={styles.marker} />
          {counts[AnnotationPPCategories.CLARIFICATION]}
        </li>
        <li className={classNames(styles.summaryItem, styles.error)}>
          <div className={styles.marker} />
          {counts[AnnotationPPCategories.ERROR]}
        </li>
      </ul>
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
      return (
        <div className={styles.self}>
          <div className={styles.summaryContainer}>
            <span className={styles.header}>Przypisy na tej stronie</span>
            {this.renderSummary()}
          </div>
          <div className={styles.chevronButton} onClick={this.props.onFullViewClick}>
            <Icon icon={ic_chevron_right} size={25}/>
          </div>
        </div>
      );
    }
  }
}
