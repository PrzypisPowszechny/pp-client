import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData, sendScrollToAnnotation } from '../../messages';
import { PopupPages } from '../BrowserPopupNavigator';
import styles from './AnnotationList.scss';

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

  onAnnotationClick = (e) => {
    console.log(e.target);
    const { annotationId } = e.target.dataset;
    sendScrollToAnnotation(annotationId);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.self}>
          loading...
        </div>);
    } else {
      return (
        <div className={styles.self}>
          <button onClick={this.handleGoBackClick}>Wróć</button>
          <ul>
          {this.state.annotationLocationData.located.map(annotation => (
            <li
              key={annotation.id}
              data-annotation-id={annotation.id}
              onClick={this.onAnnotationClick}
            >
              annotation
            </li>
          ))}
          </ul>
        </div>
      );
    }
  }
}
