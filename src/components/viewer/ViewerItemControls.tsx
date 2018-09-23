import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from './Viewer.scss';
import {
  hideViewer,
  openViewerDeleteModal,
  showEditorAnnotation,
} from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import Timer = NodeJS.Timer;
import ViewerItemDialog from './ViewerItemDialog';
import ppGA from '../../pp-ga';

interface IViewerItemControlsProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  annotation: AnnotationAPIModel;

  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  openViewerDeleteModal: (id: string) => void;
}

interface IViewerItemControlsState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
  isDialogOpen: boolean;
}

@connect(
  (state, props) => {
    const {
      location: {
          x: locationX,
          y: locationY,
      },
      deleteModal: {
        isDeleteModalOpen,
      },
    } = state.widgets.viewer;
    const viewerItem = state.widgets.viewer.viewerItems.find(item => item.annotationId === props.annotation.id);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      ...viewerItem,
    };
  }, {
    showEditorAnnotation,
    hideViewer,
    openViewerDeleteModal,
  },
)
export default class ViewerItemControls extends
  React.Component<
    Partial<IViewerItemControlsProps>,
    Partial<IViewerItemControlsState>
  > {
  static editControlDisappearTimeout = 500;

  static defaultState = {
    initialView: true,
    isDialogOpen: false,
  };

  disappearTimeoutTimer: Timer;

  constructor(props: IViewerItemControlsProps) {
    super(props);
    this.state = ViewerItemControls.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutTimer = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutTimer = null;
      },
      ViewerItemControls.editControlDisappearTimeout,
    );
  }

  componentWillUnmount() {
    if (this.disappearTimeoutTimer) {
      clearTimeout(this.disappearTimeoutTimer);
    }
  }

  onAnnotationEditClick = () => {
    const {
      locationX,
      locationY,
      annotation,
    } = this.props;
    const attrs = annotation.attributes;
    this.props.showEditorAnnotation(locationX, locationY, annotation.id);
    this.props.hideViewer();
    ppGA.annotationEditFormDisplayed(annotation.id, attrs.ppCategory, !attrs.comment, attrs.annotationLink);
  }

  onAnnotationDeleteClick = () => {
    this.props.openViewerDeleteModal(this.props.annotation.id);
  }

  toggleDialog = () => {
    this.setState({ isDialogOpen: !this.state.isDialogOpen });
  }

  render() {
    return (
      <div>
        {this.props.annotation.attributes.doesBelongToUser &&
          <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
            <button
              type="button"
              title="Edit"
              onClick={this.onAnnotationEditClick}
            >
              <i className="edit icon"/>
            </button>
            <button
              type="button"
              title="Delete"
              onClick={this.onAnnotationDeleteClick}
            >
              <i className="trash icon"/>
            </button>
          </div>
        }
        {!this.props.annotation.attributes.doesBelongToUser &&
          <div className={classNames(styles.controls, styles.visible)}>
            <button
              type="button"
              title="Edit"
              onClick={this.toggleDialog}
            >
              <span className={classNames(styles.actionsIcon)}/>
            </button>
          </div>
        }
        {this.state.isDialogOpen &&
          <ViewerItemDialog annotation={this.props.annotation} onClose={this.toggleDialog} />
        }
      </div>
    );
  }
}
