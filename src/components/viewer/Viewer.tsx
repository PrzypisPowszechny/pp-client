import React from 'react';
import classNames from 'classnames';

import Widget from 'components/widget';
import AnnotationViewModel from 'models/AnnotationViewModel';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';

interface IViewerProps {
  visible: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;
  annotations: AnnotationViewModel[];
}

export default class Viewer extends React.Component<Partial<IViewerProps>, {}> {

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
  };

  constructor(props: IViewerProps) {
    super(props);
  }

  renderItems() {
    return this.props.annotations.map(annotation => (
      <ViewerItem
        key={annotation.id}
        annotation={annotation}
      />
    ));
  }

  render() {
    return (
      <Widget
        className={classNames('pp-ui', styles.self)}
        visible={this.props.visible}
        invertedX={this.props.invertedX}
        invertedY={this.props.invertedY}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
      </Widget>
    );
  }
}
