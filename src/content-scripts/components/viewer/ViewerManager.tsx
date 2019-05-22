import React from 'react';
import { connect } from 'react-redux';

import Timer = NodeJS.Timer;
import _isEqual from 'lodash/isEqual';

import { hideViewer, setMouseOverViewer } from 'common/store/tabs/tab/widgets/actions';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';
import { PPViewerHoverContainerClass } from 'content-scripts/settings';

import Viewer from './Viewer';

interface IViewerManagerState {
  isMouseOver: boolean;
  // whether the Viewer is about to disappear
  mouseHasLeft: boolean;
  // whether the Viewer has been prevented from disappearing by the entering mouse
  mouseHasEntered: boolean;

  isDeleteModalOpen: boolean;
  deleteModalJustClosed: boolean;

  prevProps: Partial<IViewerManagerProps>;
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
    visible: false,
    isDeleteModalOpen: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // this check is a universal quick fix to allow React 16.4 compatibility
    // according to https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops
    if (!_isEqual(prevState.prevProps, nextProps)) {
      return {
        prevProps: nextProps,
        isDeleteModalOpen: nextProps.isDeleteModalOpen,
        isMouseOver: nextProps.isMouseOver,

        mouseHasLeft: prevState.isMouseOver && !nextProps.isMouseOver,
        mouseHasEntered: !prevState.isMouseOver && nextProps.isMouseOver,
        deleteModalJustClosed: prevState.isDeleteModalOpen && !nextProps.isDeleteModalOpen,
      };
    }
  }

  disappearTimeoutTimer: Timer;
  checkHoverIntervalTimer: Timer;

  constructor(props: IViewerManagerProps) {
    super(props);
    this.state = {
      prevProps: {},
    };
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
    return this.props.visible && <Viewer/>;
  }
}
