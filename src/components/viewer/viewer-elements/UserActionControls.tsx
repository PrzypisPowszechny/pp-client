import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styles from '../Viewer.scss';
import {
  hideViewer,
  openViewerDeleteModal,
  showEditorAnnotation,
} from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import Timer = NodeJS.Timer;
import UserActionDialog from './UserActionDialog';
import ppGA from '../../../pp-ga';

interface IUserActionControlsProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  annotation: AnnotationAPIModel;

  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  openViewerDeleteModal: (id: string) => void;
}

interface IUserActionControlsState {
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
export default class UserActionControls extends
  React.Component<
    Partial<IUserActionControlsProps>,
    Partial<IUserActionControlsState>
  > {
  static editControlDisappearTimeout = 500;

  static defaultState = {
    initialView: true,
    isDialogOpen: false,
  };

  disappearTimeoutTimer: Timer;

  constructor(props: IUserActionControlsProps) {
    super(props);
    this.state = UserActionControls.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutTimer = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutTimer = null;
      },
      UserActionControls.editControlDisappearTimeout,
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
        <div className={classNames(styles.controls, styles.visible)}>
          <button
            type="button"
            title="Edit"
            onClick={this.toggleDialog}
          >
            <span className={classNames(styles.actionsIcon)}/>
          </button>
        </div>
        {this.state.isDialogOpen &&
          <UserActionDialog annotation={this.props.annotation} onClose={this.toggleDialog} />
        }
      </div>
    );
  }
}
