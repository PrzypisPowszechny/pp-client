import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';
import {
  AnnotationAPIModel,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import _countBy from 'lodash/countBy';
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
      ..._countBy(annotations.map(annotation => annotation.attributes.ppCategory)),
    };
    // TODO ignore annotations with zero count
    // TODO style
    return (
      <ul>
        <li>{annotationPPCategoriesLabels.ADDITIONAL_INFO} : {counts[AnnotationPPCategories.ADDITIONAL_INFO]}</li>
        <li>{annotationPPCategoriesLabels.CLARIFICATION} : {counts[AnnotationPPCategories.CLARIFICATION]}</li>
        <li>{annotationPPCategoriesLabels.ERROR} : {counts[AnnotationPPCategories.ERROR]}</li>
      </ul>
    );
  }

  render() {
    if (this.state.willNotLoad) {
      return (
        <div className={styles.self}>
          Ta strona nie wyświetla przypisów.
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
        <div className={styles.self} onClick={this.props.onFullViewClick}>
          {this.renderSummary()}
        </div>
      );
    }
  }
}
