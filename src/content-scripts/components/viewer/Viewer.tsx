import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { setMouseOverViewer } from 'common/store/tabs/tab/widgets/actions';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';
import Widget from 'content-scripts/components/widget';
import { PPScopeClass, PPViewerHoverContainerClass, PPViewerIndirectChildClass } from 'content-scripts/settings';

import DeleteAnnotationModal from './DeleteAnnotationModal';
import styles from './Viewer.scss';
import ViewerItem from './ViewerItem';

interface IViewerProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;

  annotationIds: string[];

  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  setMouseOverViewer: (value: boolean) => void;
  openViewerDeleteModal: (id: string) => void;
}

@connect(
  (state) => {
    const {
      locationX,
      locationY,
      deleteModal: {
        isDeleteModalOpen,
      },
      annotationIds,
    } = selectViewerState(state);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      annotationIds,
    };
  }, {
    setMouseOverViewer,
  },
)
export default class Viewer extends React.Component<Partial<IViewerProps>, {}> {

  static defaultProps = {
    locationX: 0,
    locationY: 0,
    annotations: [],
  };

  constructor(props: IViewerProps) {
    super(props);
  }

  handleMouseLeave = (e) => {
    // Normally, close the window, except...
    // not when the modal is open
    // not when this element is manually marked as an indirect Viewer child (despite not being a DOM child)
    // (related target can be null e.g. on tab change)
    const isMouseOverIndirectChild = e.relatedTarget && e.relatedTarget.classList.contains(PPViewerIndirectChildClass);
    if (!isMouseOverIndirectChild) {
      // check what element the pointer entered;
      this.props.setMouseOverViewer(false);
    }
  }

  handleMouseEnter = () => {
    this.props.setMouseOverViewer(true);
  }

  renderItems() {
    return this.props.annotationIds.map((id) => {
      return (
        <ViewerItem
          key={id}
          annotationId={id}
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
        offsetClassName={classNames(PPScopeClass, PPViewerHoverContainerClass)}
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
