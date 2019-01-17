import React from 'react';
import { loadAnnotationLocationData, PopupAnnotationLocationData, sendScrollToAnnotation } from '../../messages';
import { PopupPages } from '../BrowserPopupNavigator';
import { AnnotationPPCategories } from 'common/api/annotations';
import styles from './AnnotationList.scss';
import { Icon } from 'react-icons-kit';
import { ic_chevron_left } from 'react-icons-kit/md/ic_chevron_left';
import classNames from 'classnames';

export interface IAnnotationListProps {
  onPageChange: (Event) => void;
}

interface IAnnotationListState {
  isLoading: boolean;
  annotationLocationData: PopupAnnotationLocationData;
}

export default class AnnotationList extends React.Component<Partial<IAnnotationListProps>,
  Partial<IAnnotationListState>> {

  markerStyles = {
    [AnnotationPPCategories.ADDITIONAL_INFO]: styles.additionalInfo,
    [AnnotationPPCategories.CLARIFICATION]: styles.clarification,
    [AnnotationPPCategories.ERROR]: styles.error,
  };

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
    const { annotationId } = e.currentTarget.dataset;
    sendScrollToAnnotation(annotationId);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.self}>
          Ładuję...
        </div>);
    } else {
      return (
        <div className={styles.self}>
          <div onClick={this.handleGoBackClick}>
            <Icon className={styles.chevronButton} icon={ic_chevron_left} size={25}/>
          </div>
          <ul className={styles.annotationList}>
          {this.state.annotationLocationData.located.map(annotation => (
            <li
              className={styles.listItem}
              key={annotation.id}
              data-annotation-id={annotation.id}
              onClick={this.onAnnotationClick}
            >
              <div className={classNames(styles.marker, this.markerStyles[annotation.attributes.ppCategory])}/>
              <div className={styles.annotationTexts}>
                <div className={styles.quote} >"{annotation.attributes.quote}"</div>
                <div className={styles.comment} >{annotation.attributes.comment}</div>
              </div>
            </li>
          ))}
          </ul>
        </div>
      );
    }
  }
}
