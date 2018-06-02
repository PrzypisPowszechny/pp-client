import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';
import { Button, Modal } from 'semantic-ui-react';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, mouseOverViewer, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
import Timer = NodeJS.Timer;
import Viewer from './Viewer';
import _isEqual from 'lodash/isEqual';

interface IViewerManagerState {
  mouseOver: boolean;
  // whether the Viewer is about to disappear
  mouseHasLeft: boolean;
  // whether the Viewer has been prevented from disappearing by the entering mouse
  mouseHasEntered: boolean;

  deleteModalOpen: boolean;
  deleteModalJustClosed: boolean;
}

interface IViewerManagerProps {
  visible: boolean;
  mouseOver: boolean;
  deleteModalOpen: boolean;
  annotationIds: string[];

  mouseOverViewer: (value: boolean) => void;
  hideViewer: () => void;
  showViewer: () => void;
}

@connect(
  (state) => {
    const {
      visible,
      mouseOver,
      deleteModal: {
        deleteModalOpen,
      },
      annotationIds,
    } = selectViewerState(state);

    return {
      visible,
      mouseOver,
      deleteModalOpen,
      annotationIds,
    };
  },
  {
    hideViewer,
    mouseOverViewer,
  },
)
export default class ViewerManager extends React.Component<Partial<IViewerManagerProps>, Partial<IViewerManagerState>> {
  /*
   * ViewerManager purpose is to centrally manage mouse events, both related to Viewer widget and highlight-related .
   * (note: Especially the latter couldn't be correctly done by a Viewer that is mounted on
   * the highlight mouseover event, since Viewer could not subscribe to highlight mouseleave event quickly enough
   * -- before the pointer leaves it. It was the first attempted solution and quick mouse movements were in fact
   * not captured)
   */

  static mouseleaveDisappearTimeout = 200;
  static modalCloseDisappearTimeout = 1100;

  static defaultProps = {
    visible: true,
    deleteModalOpen: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      deleteModalOpen: nextProps.deleteModalOpen,
      mouseOver: nextProps.mouseOver,

      mouseHasLeft: prevState.mouseOver && !nextProps.mouseOver,
      mouseHasEntered: !prevState.mouseOver && nextProps.mouseOver,
      deleteModalJustClosed: prevState.deleteModalOpen && !nextProps.deleteModalOpen,
    };
  }

  disappearTimeoutId: Timer;

  constructor(props: IViewerManagerProps) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    this.updateTimers();
  }

  componentDidMount() {
    this.updateTimers();
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
  }

  startDisappearTimer(timeout: number) {
    // clear the timer so more than one cannot accumulate
    this.clearDisappearTimer();
    this.disappearTimeoutId = setTimeout(
      () => {
        this.disappearTimeoutId = null;
        this.props.hideViewer();
      },
      timeout,
    );
  }

  clearDisappearTimer() {
    if (this.disappearTimeoutId) {
      clearTimeout(this.disappearTimeoutId);
      this.disappearTimeoutId = null;
    }
  }

  updateTimers() {
    if (this.state.mouseHasLeft) {
      if (this.state.deleteModalJustClosed) {
        this.startDisappearTimer(ViewerManager.modalCloseDisappearTimeout);
      } else {
        this.startDisappearTimer(ViewerManager.mouseleaveDisappearTimeout);
      }
    } else if (this.state.mouseHasEntered) {
      this.clearDisappearTimer();
    }
  }

  render() {
    return (
      this.props.visible && <Viewer/>
    );
  }
}
