import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_delete } from 'react-icons-kit/md/ic_delete';
import { ic_mode_edit } from 'react-icons-kit/md/ic_mode_edit';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { AnnotationAPIModel } from 'common/api/annotations';
import ppGa from 'common/pp-ga';
import { selectTab } from 'common/store/tabs/selectors';
import { hideViewer, openViewerDeleteModal, showEditorAnnotation } from 'common/store/tabs/tab/widgets/actions';

import styles from '../ViewerItem.scss';
import Timer = NodeJS.Timer;

interface IAuthorActionControlsProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  annotation: AnnotationAPIModel;

  showEditorAnnotation: (x: number, y: number, id?: string) => void;
  hideViewer: () => void;
  openViewerDeleteModal: (id: string) => void;
}

interface IAuthorActionControlsState {
  initialView: boolean; // used to determine whether edit/delete buttons should be visible
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
    } = selectTab(state).widgets.viewer;
    const annotation =
      selectTab(state).widgets.viewer.annotations.find(item => item.annotationId === props.annotation.id);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      ...annotation,
    };
  }, {
    showEditorAnnotation,
    hideViewer,
    openViewerDeleteModal,
  },
)
export default class AuthorActionControls extends
  React.Component<
    Partial<IAuthorActionControlsProps>,
    Partial<IAuthorActionControlsState>
  > {
  static editControlDisappearTimeout = 500;

  static defaultState = {
    initialView: true,
  };

  disappearTimeoutTimer: Timer;

  constructor(props: IAuthorActionControlsProps) {
    super(props);
    this.state = AuthorActionControls.defaultState;
  }

  componentDidMount() {
    this.disappearTimeoutTimer = setTimeout(
      () => {
        this.setState({ initialView: false });
        this.disappearTimeoutTimer = null;
      },
      AuthorActionControls.editControlDisappearTimeout,
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
    ppGa.annotationEditFormOpened(annotation.id, attrs.ppCategory, !attrs.comment, attrs.annotationLink);
  }

  onAnnotationDeleteClick = () => {
    this.props.openViewerDeleteModal(this.props.annotation.id);
  }

  render() {
    return (
      <div className={classNames(styles.controls, { [styles.visible]: this.state.initialView })}>
        <button
          className={styles.ppButton}
          type="button"
          title="Edit"
          onClick={this.onAnnotationEditClick}
        >
          <Icon icon={ic_mode_edit} size={18} />
        </button>
        <button
          className={styles.ppButton}
          type="button"
          title="Delete"
          onClick={this.onAnnotationDeleteClick}
        >
          <Icon icon={ic_delete} size={18} />
        </button>
      </div>
    );
  }
}
