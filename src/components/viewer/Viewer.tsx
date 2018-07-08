import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, openViewerDeleteModal, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
import { mouseOverViewer } from 'store/widgets/actions';
import DeleteAnnotationModal from './DeleteAnnotationModal';

interface IViewerProps {
  locationX: number;
  locationY: number;
  annotationIds: string[];
  deleteModalOpen: boolean;

  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  mouseOverViewer: (value: boolean) => void;
  openViewerDeleteModal: (id: string) => void;
}

@connect(
  (state) => {
    const {
      visible,
      locationX,
      locationY,
      deleteModal: {
        deleteModalOpen,
      },
      annotationIds,
    } = selectViewerState(state);

    return {
      visible,
      locationX,
      locationY,
      deleteModalOpen,
      annotationIds,
    };
  },
  {
    showEditorAnnotation,
    hideViewer,
    mouseOverViewer,
    openViewerDeleteModal,
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

  handleMouseLeave = (e) => {
    console.log('leave check');
    // Normally, close the window, except...
    // not when the modal is open
    // not when this element is manually marked as an indirect Viewer child (despite not being a DOM child)
    // (related target can be null e.g. on tab change)
    const isMouseOverIndirectChild = e.relatedTarget && e.relatedTarget.classList.contains(PPViewerIndirectChildClass);
    if (!this.props.deleteModalOpen && !isMouseOverIndirectChild) {
      // check what element the pointer entered;
      this.props.mouseOverViewer(false);
      console.log('leave confirmed');
    }
  }

  handleMouseEnter = (e) => {
    this.props.mouseOverViewer(true);
  }

  renderItems() {
    return this.props.annotationIds.map((id) => {
      return (
        <ViewerItem
          key={id}
          annotationId={id}
          onDelete={this.props.openViewerDeleteModal}
          onEdit={this.onItemEdit}
          // ignore these elements on mouseleave
          indirectChildClassName={PPViewerIndirectChildClass}
        />
      );
    });
  }

  render() {
    return (
      <Widget
        className={classNames(PPScopeClass, styles.self)}
        offsetClassName={classNames(PPScopeClass, styles.selfOffset)}
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
        <DeleteAnnotationModal/>
      </Widget>
    );
  }
}
