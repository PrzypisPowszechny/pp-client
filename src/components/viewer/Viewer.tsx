import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Widget from 'components/widget';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';

interface IViewerProps {
  locationX: number;
  locationY: number;
  annotations: AnnotationAPIModel[];

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
    // [roadmap 5.3] TODO connect to redux-json-api call
    console.log('Annotation should be deleted now; not implemented yet!');
    this.props.hideViewer();
  }

  renderItems() {
    return this.props.annotations.map((annotation) => {
      const attrs = annotation.attributes;
      return (
        <ViewerItem
          key={annotation.id}

          annotationId={annotation.id}
          comment={attrs.comment}
          doesBelongToUser={attrs.doesBelongToUser}
          priority={attrs.priority}
          upvote={attrs.upvote}
          upvoteCount={attrs.upvoteCount}
          annotationLink={attrs.annotationLink}
          annotationLinkTitle={attrs.annotationLinkTitle}
          onEdit={this.onItemEdit}
          onDelete={this.onItemDelete}

          createDate={new Date()} // TODO use date from API (now missing)
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
