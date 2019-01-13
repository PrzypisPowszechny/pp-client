import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData, sendScrollToAnnotation } from '../../messages';
import { PopupPages } from '../BrowserPopupNavigator';
import styles from './AnnotationList.scss';
import { Icon } from 'react-icons-kit';
import { ic_chevron_left } from 'react-icons-kit/md/ic_chevron_left';

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
          <div onClick={this.handleGoBackClick}>
            <Icon className="icon" icon={ic_chevron_left} size={25}/>
          </div>
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
