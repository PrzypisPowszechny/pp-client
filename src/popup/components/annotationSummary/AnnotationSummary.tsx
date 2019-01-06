import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';

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

  render() {
    return (
      <div>{this.state.isLoading ? 'loading' : 'loaded'}</div>
    );
  }
}
