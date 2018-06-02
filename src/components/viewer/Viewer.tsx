import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';
import { Button, Modal } from 'semantic-ui-react';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, hideViewerDeleteModal, openViewerDeleteModal, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
import Timer = NodeJS.Timer;
import Highlighter from 'core/Highlighter';
import { mouseOverViewer } from '../../store/widgets/actions';

interface IViewerProps {
  locationX: number;
  locationY: number;
  annotations: AnnotationAPIModel[];
  deleteModalId: string;
  deleteModalOpen: boolean;

  onModalClose: (Event) => void;

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  mouseOverViewer: (value: boolean) => void;
  openViewerDeleteModal: (id: string) => void;
  hideViewerDeleteModal: () => void;
}

@connect(
  (state) => {
    const {
      visible,
      locationX,
      locationY,
      deleteModal: {
        deleteModalId,
        deleteModalOpen,
      },
      annotations,
    } = selectViewerState(state);

    return {
      visible,
      locationX,
      locationY,
      deleteModalId,
      deleteModalOpen,
      annotations,
    };
  },
  {
    showEditorAnnotation,
    hideViewer,
    mouseOverViewer,
    openViewerDeleteModal,
    hideViewerDeleteModal,
    deleteAnnotation: deleteResource,
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
    this.props.openViewerDeleteModal(id);
  }

  onItemConfirmedDelete = (e) => {
    const annotation = this.props.annotations.find(a => a.id === this.props.deleteModalId);
    this.props.deleteAnnotation(annotation)
      .catch((errors) => {
        console.log(errors);
      });
  }

  setDeleteModalClosed = (e) => {
    this.props.hideViewerDeleteModal();
    this.props.mouseOverViewer(false);
  }

  handleMouseLeave = (e) => {
    // Normally, close the window, except...
    // not when the modal is not open
    // not when this element is manually marked as an indirect Viewer child (despite not being a DOM child)
    const isMouseOverIndirectChild = e.relatedTarget.classList.contains(PPViewerIndirectChildClass);
    if (!this.props.deleteModalOpen && !isMouseOverIndirectChild) {
      // check what element the pointer entered;
      this.props.mouseOverViewer(false);
    }
  }

  handleMouseEnter = (e) => {
    this.props.mouseOverViewer(true);
  }

  renderItems() {
    return this.props.annotations.map((annotation) => {
      const attrs = annotation.attributes;
      return (
        <ViewerItem
          key={annotation.id}
          annotation={annotation}
          onDelete={this.props.openViewerDeleteModal}
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
        open={this.props.deleteModalOpen}
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
        className={classNames(PPScopeClass, styles.self)}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
        updateInverted={true}
        widgetTriangle={true}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
        {this.renderDeleteModal()}
      </Widget>
    );
  }
}
