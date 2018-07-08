import React from 'react';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, mouseOverViewer } from 'store/widgets/actions';
import Viewer from './Viewer';
import Timer = NodeJS.Timer;
import styles from './Viewer.scss';

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
  isAnyReportEditorOpen: boolean;

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
      isAnyReportEditorOpen,
    } = selectViewerState(state);

    return {
      visible,
      mouseOver,
      deleteModalOpen,
      annotationIds,
      isAnyReportEditorOpen,
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

  disappearTimeoutTimer: Timer;
  checkHoverIntervalTimer: Timer;

  constructor(props: IViewerManagerProps) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    this.updateDisappearTimer();
  }

  componentDidMount() {
    this.updateDisappearTimer();
    this.checkHoverIntervalTimer = setInterval(this.checkHover, 1000);
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
    clearInterval(this.checkHoverIntervalTimer);
  }

  checkHover = () => {
    if (document.querySelectorAll(`.${styles.selfOffset} :hover`).length) {
      console.log('hover!');
      if (this.state.mouseHasLeft) {
        this.props.mouseOverViewer(true);
      }
    } else {
      console.log('no hover...');
      if (this.state.mouseHasEntered) {
        this.props.mouseOverViewer(false);
      }
    }
  }

  startDisappearTimer(timeout: number) {
    // clear the timer so more than one cannot accumulate
    this.clearDisappearTimer();
    this.disappearTimeoutTimer = setTimeout(
      () => {
        this.disappearTimeoutTimer = null;
        this.props.hideViewer();
      },
      timeout,
    );
  }

  clearDisappearTimer() {
    if (this.disappearTimeoutTimer) {
      clearTimeout(this.disappearTimeoutTimer);
      this.disappearTimeoutTimer = null;
    }
  }

  updateDisappearTimer() {
    if (this.state.mouseHasLeft) {
      if (this.state.deleteModalJustClosed) {
        this.startDisappearTimer(ViewerManager.modalCloseDisappearTimeout);
      } else if (!this.props.isAnyReportEditorOpen) {
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
