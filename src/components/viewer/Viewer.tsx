import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';
import { Button, Modal } from 'semantic-ui-react';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
import Timer = NodeJS.Timer;

interface IViewerProps {
  locationX: number;
  locationY: number;
  annotations: AnnotationAPIModel[];

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
}

interface IViewerState {
  confirmDeleteModalOpen: boolean;
  deleteAnnotationId: string;
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
    deleteAnnotation: deleteResource,
  },
)
export default class Viewer extends React.Component<Partial<IViewerProps>, Partial<IViewerState>> {

  static mouseleaveDisappearTimeout = 200;

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
    annotations: [],
  };

  disappearTimeoutId: Timer;

  constructor(props: IViewerProps) {
    super(props);
    this.state = {
      confirmDeleteModalOpen: false,
      deleteAnnotationId: null,
    };
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
  }

  startDisappearTimer() {
    this.disappearTimeoutId = setTimeout(
      () => {
        this.disappearTimeoutId = null;
        this.props.hideViewer();
      },
      Viewer.mouseleaveDisappearTimeout,
    );
  }

  clearDisappearTimer() {
    if (this.disappearTimeoutId) {
      clearTimeout(this.disappearTimeoutId);
    }
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
    this.setState({
      confirmDeleteModalOpen: true,
      deleteAnnotationId: id,
    });
  }
  onItemConfirmedDelete = (e) => {
    const annotation = this.props.annotations.find(a => a.id === this.state.deleteAnnotationId);
    this.props.deleteAnnotation(annotation)
      .catch((errors) => {
        console.log(errors);
      });
    this.setState({
      confirmDeleteModalOpen: false,
      deleteAnnotationId: null,
    });
  }

  onMouseLeave = (e) => {
    // Normally, close the window, except...
    // not when the modal is not open
    // not when this element is manually marked as an indirect Viewer child (despite not being a DOM child)
    const isMouseOverIndirectChild = e.relatedTarget.classList.contains(PPViewerIndirectChildClass);
    if (!this.state.confirmDeleteModalOpen && !isMouseOverIndirectChild) {
      // check what element the pointer entered;
      this.startDisappearTimer();
    }
  }

  onMouseEnter = (e) => {
    this.clearDisappearTimer();
  }

  setDeleteModalClosed = (e) => {
    // todo: in the future we should handle the case when the modal has just been closed and
    // the cursor is outside the viewer (so it never actually leaves the viewer area)
    this.setState({
      confirmDeleteModalOpen: false,
      deleteAnnotationId: null,
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
          // ignore these elements on mouseleave
          indirectChildClassName={PPViewerIndirectChildClass}
        />
      );
    });
  }

  renderDeleteModal() {
    return (
      <Modal
        size="mini"
        className={PPScopeClass}
        open={this.state.confirmDeleteModalOpen}
      >
        <Modal.Content>
          <p>Czy na pewno chcesz usunąć przypis?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.setDeleteModalClosed} size="tiny" negative={true}>
            Nie
          </Button>
          <Button onClick={this.onItemConfirmedDelete} size="tiny" positive={true}>
            Tak
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    return (
      <Widget
        className={classNames('pp-ui', styles.self)}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
        updateInverted={true}
        widgetTriangle={true}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
        {this.renderDeleteModal()}
      </Widget>
    );
  }
}
