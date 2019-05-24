import React from 'react';
import { connect } from 'react-redux';

import Timer = NodeJS.Timer;
import _isEqual from 'lodash/isEqual';

import { hideViewer, setMouseOverViewer } from 'common/store/tabs/tab/widgets/actions';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';

import Viewer from './Viewer';

interface IViewerManagerProps {
  visible: boolean;
  mouseOver: boolean;
  isDeleteModalOpen: boolean;
  annotationIds: string[];
  isAnyReportEditorOpen: boolean;

  hideViewer: () => void;
  setMouseOverViewer: (value: boolean) => void;
}

interface IViewerManagerState {
  // keep track of previous mouseOver from props
  mouseOver: boolean;
  // whether the Viewer is about to disappear
  mouseHasLeft: boolean;
  // whether the Viewer has been prevented from disappearing by the entering mouse
  mouseHasEntered: boolean;

  deleteModalHasClosed: boolean;

  prevProps: Partial<IViewerManagerProps>;
}

@connect(
  (state) => {
    const {
      visible,
      mouseOver,
      deleteModal: {
        isDeleteModalOpen,
      },
      annotationIds,
      isAnyReportEditorOpen,
    } = selectViewerState(state);

    return {
      visible,
      mouseOver,
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
   * ViewerManager purpose is to centrally manage viewer visibility depending on the current viewr mouseOver redux state
   */

  static mouseLeaveDisappearTimeout = 200;
  static modalCloseDisappearTimeout = 1100;

  static getDerivedStateFromProps(nextProps, prevState) {
    // this check is a universal quick fix to allow React 16.4 compatibility
    // todo: this usage of getDerivedStateFromProps is discouraged
    // according to https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops
    if (!_isEqual(prevState.prevProps, nextProps)) {
      return {
        prevProps: nextProps,

        mouseOver: nextProps.mouseOver,

        mouseHasLeft: prevState.mouseOver && !nextProps.mouseOver,
        mouseHasEntered: !prevState.mouseOver && nextProps.mouseOver,
        deleteModalHasClosed: prevState.isDeleteModalOpen && !nextProps.isDeleteModalOpen,
      };
    }
    return null;
  }

  disappearTimeoutTimer: Timer;

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
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
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
      if (this.state.deleteModalHasClosed) {
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
