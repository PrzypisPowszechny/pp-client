import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';
import {
  AnnotationAPIModel,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import _countBy from 'lodash/countBy';

export interface IAnnotationSummaryProps {
  onFullViewClick: (Event) => void;
}

interface IAnnotationSummaryState {
  isLoading: boolean;
  annotationLocationData: PopupAnnotationLocationData;
}

export default class AnnotationSummary extends React.Component<Partial<IAnnotationSummaryProps>,
  Partial<IAnnotationSummaryState>> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    loadAnnotationLocationData().then((data) => {
      this.setState({
        annotationLocationData: data,
        isLoading: false,
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
    if (this.state.isLoading) {
      return (
        <div className="annotation-summary">
          loading...
        </div>);
    } else {
      return (
        <div className="annotation-summary">
          <button onClick={this.props.onFullViewClick}>See more</button>
          {this.renderSummary()}
        </div>
      );
    }
  }
}
