import React from 'react';
import { connect } from 'react-redux';
import { selectViewerState } from 'content-scripts/store/widgets/selectors';
import { hideViewer, setMouseOverViewer } from 'content-scripts/store/widgets/actions';
import Viewer from './Viewer';
import Timer = NodeJS.Timer;
import { PPViewerHoverContainerClass } from 'content-scripts/settings';

interface IViewerManagerState {
  isMouseOver: boolean;
  // whether the Viewer is about to disappear
  mouseHasLeft: boolean;
  // whether the Viewer has been prevented from disappearing by the entering mouse
  mouseHasEntered: boolean;

  isDeleteModalOpen: boolean;
  deleteModalJustClosed: boolean;
}

interface IViewerManagerProps {
  visible: boolean;
  isMouseOver: boolean;
  isDeleteModalOpen: boolean;
  annotationIds: string[];
  isAnyReportEditorOpen: boolean;

  setMouseOverViewer: (value: boolean) => void;
  hideViewer: () => void;
  showViewer: () => void;
}

@connect(
  (state) => {
    const {
      visible,
      mouseOver: isMouseOver,
      deleteModal: {
        isDeleteModalOpen,
      },
      annotationIds,
      isAnyReportEditorOpen,
    } = selectViewerState(state);

    return {
      visible,
      isMouseOver,
      isDeleteModalOpen,
      annotationIds,
      isAnyReportEditorOpen,
    };
  }, {
    hideViewer,
    setMouseOverViewer,
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

  static mouseLeaveDisappearTimeout = 200;
  static modalCloseDisappearTimeout = 1100;

  static defaultProps = {
    visible: true,
    isDeleteModalOpen: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isDeleteModalOpen: nextProps.isDeleteModalOpen,
      isMouseOver: nextProps.isMouseOver,

      mouseHasLeft: prevState.isMouseOver && !nextProps.isMouseOver,
      mouseHasEntered: !prevState.isMouseOver && nextProps.isMouseOver,
      deleteModalJustClosed: prevState.isDeleteModalOpen && !nextProps.isDeleteModalOpen,
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
    this.checkHoverIntervalTimer = setInterval(this.checkHover, 200);
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
    clearInterval(this.checkHoverIntervalTimer);
  }

  checkHover = () => {
    if (document.querySelectorAll(`.${PPViewerHoverContainerClass} :hover`).length) {
      if (!this.state.isMouseOver) {
        this.props.setMouseOverViewer(true);
      }
    } else {
      if (this.state.isMouseOver) {
        this.props.setMouseOverViewer(false);
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
      } else if (!this.props.isAnyReportEditorOpen && !this.props.isDeleteModalOpen) {
        this.startDisappearTimer(ViewerManager.mouseLeaveDisappearTimeout);
      }
    } else if (this.state.mouseHasEntered) {
      this.clearDisappearTimer();
    }
  }

  render() {
    // return this.props.visible && <Viewer/>;
    return  <Viewer/>;
  }
}
