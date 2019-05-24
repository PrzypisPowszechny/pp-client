import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { setMouseOverViewer } from 'common/store/tabs/tab/widgets/actions';
import { selectViewerState } from 'common/store/tabs/tab/widgets/selectors';
import Widget from 'content-scripts/components/widget';
import {
  PPHighlightIdAttr,
  PPScopeClass,
  PPViewerIndirectHoverClass,
} from 'content-scripts/settings';

import DeleteAnnotationModal from './DeleteAnnotationModal';
import styles from './Viewer.scss';
import ViewerItem from './ViewerItem';
import Timer = NodeJS.Timer;

interface IViewerProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  mouseOver: boolean;
  annotationIds: string[];

  setMouseOverViewer: (value: boolean) => void;
}

/*
 * Note on hover checking:
 * This component handles autonomously the mouse hover state
 * Its visibility should be set by a higher component depending on changes in its hover state
 */
@connect(
  (state) => {
    const {
      locationX,
      locationY,
      deleteModal: {
        isDeleteModalOpen,
      },
      mouseOver,
      annotationIds,
    } = selectViewerState(state);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      mouseOver,
      annotationIds,
    };
  }, {
    setMouseOverViewer,
  },
)
export default class Viewer extends React.Component<Partial<IViewerProps>, {}> {

  static hoverCheckInterval = 200;

  checkHoverIntervalTimer: Timer;

  private readonly rootHoverClass: string;

  constructor(props: IViewerProps) {
    super(props);
    this.rootHoverClass = 'pp-viewer-hover-body';
  }

  componentDidMount() {
    this.checkHoverIntervalTimer = setInterval(this.checkHover, Viewer.hoverCheckInterval);
  }

  componentWillUnmount() {
    clearInterval(this.checkHoverIntervalTimer);
  }

  checkHover = () => {
    let mouseOver = false;

    if (document.querySelectorAll(`
      .${this.rootHoverClass}:hover,
      .${this.rootHoverClass} :hover,
      .${PPViewerIndirectHoverClass}:hover,
      .${PPViewerIndirectHoverClass} :hover
    `).length) {
      mouseOver = true;
    }

    if (!mouseOver) {
      document.querySelectorAll(`
        [${PPHighlightIdAttr}]:hover
      `).forEach((node) => {
        for (const annotationId of this.props.annotationIds) {
          if (node.matches(`[${PPHighlightIdAttr}="annotation:${annotationId}"]`)) {
            mouseOver = true;
          }
        }
      });
    }
    if (mouseOver && !this.props.mouseOver) {
      this.props.setMouseOverViewer(true);
    }
    if (!mouseOver && this.props.mouseOver) {
      this.props.setMouseOverViewer(false);
    }
  }

  renderItems() {
    return this.props.annotationIds.map((id) => {
      return (
        <ViewerItem
          key={id}
          annotationId={id}
        />
      );
    });
  }

  render() {
    return (
      <Widget
        className={classNames(PPScopeClass, styles.self)}
        offsetClassName={this.rootHoverClass}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
        updateInverted={true}
        widgetTriangle={true}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
        <DeleteAnnotationModal/>
      </Widget>
    );
  }
}
