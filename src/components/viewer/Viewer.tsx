import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import {selectViewerState} from 'store/widgets/selectors';
import {hideViewer, showEditorAnnotation} from 'store/widgets/actions';
import {AnnotationPriorities, annotationPrioritiesLabels} from 'components/consts';
import {AnnotationAPIModel} from 'api/annotations';

interface IViewerProps {
  locationX: number;
  locationY: number;
  annotations: AnnotationAPIModel[];

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
}

/*
 * TODO list
 * - [roadmap 6.1.4] the appear/disappear logic of Viewer is just a simulation and should be refined or
  * (preferably) straightforwardly adapted from old_src/ViewerWidget
 */
@connect(
  (state) => {
    const {
      locationX,
      locationY,
      annotations,
    } = selectViewerState(state);

    return {
      locationX,
      locationY,
      annotations,
    };
  },
  {
    showEditorAnnotation,
    hideViewer,
    deleteAnnotation: (instance: AnnotationAPIModel) => deleteResource(instance),
  },
)

export default class Viewer extends React.Component<Partial<IViewerProps>, {}> {

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
      annotations: [],
  };

  constructor(props: IViewerProps) {
    super(props);
  }

  onItemEdit = (id: string) => {
    const {
      locationX,
      locationY,
    } = this.props;
    this.props.showEditorAnnotation(locationX, locationY, id);
    this.props.hideViewer();
  }

  onItemDelete = (id: string) => {
    const annotation = this.props.annotations.find(a => a.id === id);
    this.props.deleteAnnotation(annotation)
      .catch((errors) => {
        console.log(errors);
      });
  }

  renderItems() {
    return this.props.annotations.map((annotation) => {
      const attrs = annotation.attributes;
      return (
        <ViewerItem
          key={annotation.id}
          annotation={annotation}
          onDelete={this.onItemDelete}
          onEdit={this.onItemEdit}
        />
      );
    });
  }

  render() {
    return (
      <Widget
        className={classNames('pp-ui', styles.self)}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
        updateInverted={true}
        widgetTriangle={true}
        onMouseLeave={this.props.hideViewer}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
      </Widget>
    );
  }
}
