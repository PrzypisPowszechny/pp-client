import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData } from '../../messages';
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
