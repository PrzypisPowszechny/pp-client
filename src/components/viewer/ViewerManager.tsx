import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createResource, deleteResource } from 'redux-json-api';
import Widget from 'components/widget';
import { Button, Modal } from 'semantic-ui-react';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import { selectViewerState } from 'store/widgets/selectors';
import { hideViewer, showEditorAnnotation } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass, PPViewerIndirectChildClass } from 'class_consts.ts';
import Timer = NodeJS.Timer;
import Highlighter from 'core/Highlighter';
import Viewer from './Viewer';
import _isEqual from 'lodash/isEqual';

interface IViewerManagerProps {
  visible: boolean;
  deleteModalOpen: boolean;
  annotationIds: string[];

  highlighter: Highlighter;

  hideViewer: () => void;
  showViewer: () => void;
}

@connect(
  (state) => {
    const {
      visible,
      deleteModal: {
        deleteModalOpen,
      },
      annotationIds,
    } = selectViewerState(state);

    return {
      visible,
      deleteModalOpen,
      annotationIds,
    };
  },
  {
    hideViewer,
  },
)
export default class ViewerManager extends React.Component<Partial<IViewerManagerProps>, {}> {
  /*
   * ViewerManager purpose is to centrally manage mouse events, both related to Viewer widget and highlight-related .
   * (note: Especially the latter couldn't be correctly done by a Viewer that is mounted on
   * the highlight mouseover event, since Viewer could not subscribe to highlight mouseleave event quickly enough
   * -- before the pointer leaves it. It was the first attempted solution and quick mouse movements were in fact
   * not captured)
   *
   * Highlighter component is provided from the outside and lets ViewerManager subscribe directly
   * to highlight mouse events.
   */

  static mouseleaveDisappearTimeout = 200;

  static defaultProps = {
    visible: true,
    deleteModalOpen: false,
  };

  disappearTimeoutId: Timer;

  constructor(props: IViewerManagerProps) {
    super(props);
  }

  componentDidMount() {
    this.props.highlighter.onHighlightEvent('mouseover', this.onHighlightMouseover);
    this.props.highlighter.onHighlightEvent('mouseleave', this.onHighlightMouseleave);
  }

  componentWillUnmount() {
    this.clearDisappearTimer();
  }

  onHighlightMouseover = (e, annotations) => {
    this.clearDisappearTimer();
  }

  onHighlightMouseleave = (e, annotations) => {
    const eventAnnotations = annotations.map(ann => ann.id);
    // Make sure the leave event is up-to-date
    if (_isEqual(eventAnnotations, this.props.annotationIds)) {
      this.startDisappearTimer();
    }
  }

  startDisappearTimer() {
    // clear the timer so more than one cannot accumulate
    this.clearDisappearTimer();
    this.disappearTimeoutId = setTimeout(
      () => {
        this.disappearTimeoutId = null;
        this.props.hideViewer();
      },
      ViewerManager.mouseleaveDisappearTimeout,
    );
  }

  clearDisappearTimer() {
    if (this.disappearTimeoutId) {
      clearTimeout(this.disappearTimeoutId);
      this.disappearTimeoutId = null;
    }
  }

  onMouseLeave = (e) => {
    // Normally, close the window, except...
    // not when the modal is not open
    // not when this element is manually marked as an indirect Viewer child (despite not being a DOM child)
    const isMouseOverIndirectChild = e.relatedTarget.classList.contains(PPViewerIndirectChildClass);
    if (!this.props.deleteModalOpen && !isMouseOverIndirectChild) {
      // check what element the pointer entered;
      this.startDisappearTimer();
    }
  }

  onMouseEnter = (e) => {
    this.clearDisappearTimer();
  }

  render() {
    if (this.props.visible) {
      return (
        <Viewer
          onMouseLeave={this.onMouseLeave}
          onMouseEnter={this.onMouseEnter}
        />
      );
    } else {
      return null;
    }
  }
}
