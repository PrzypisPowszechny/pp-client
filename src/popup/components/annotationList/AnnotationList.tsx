import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';
import {
  AnnotationAPIModel,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import _countBy from 'lodash/countBy';
import { PopupPages } from '../BrowserPopupNavigator';

export interface IAnnotationListProps {
  onPageChange: (Event) => void;
}

interface IAnnotationListState {
  isLoading: boolean;
  annotationLocationData: PopupAnnotationLocationData;
}

export default class AnnotationList extends React.Component<Partial<IAnnotationListProps>,
  Partial<IAnnotationListState>> {
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

  handleGoBackClick = (e) => {
    this.props.onPageChange(PopupPages.main);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="annotation-list">
          loading...
        </div>);
    } else {
      return (
        <div className="annotation-list">
          <button onClick={this.handleGoBackClick}>Wróć</button>
          {this.state.annotationLocationData.located.map(annotation => (
            <div>
              annotation
            </div>
          ))}
        </div>
      );
    }
  }
}
