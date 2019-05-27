import React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { AnnotationResourceType } from 'common/api/annotations';
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

import { AnnotationRequestResourceType } from '../../../common/api/annotation-requests';
import Timer = NodeJS.Timer;
import { resourceToHighlightId } from '../../utils/Highlighter';

interface IViewerProps {
  locationX: number;
  locationY: number;
  isDeleteModalOpen: boolean;
  mouseOver: boolean;
  annotationIds: string[];
  annotationRequestIds: string[];

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
      annotationRequestIds,
    } = selectViewerState(state);

    return {
      locationX,
      locationY,
      isDeleteModalOpen,
      mouseOver,
      annotationIds,
      annotationRequestIds,
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
    this.checkHoverIntervalTimer = setInterval(this.doesHover, Viewer.hoverCheckInterval);
  }

  componentWillUnmount() {
    clearInterval(this.checkHoverIntervalTimer);
  }

  doesHoverOverOwnHighlight() {
    const { annotationIds, annotationRequestIds } = this.props;
    const nodes = document.querySelectorAll(`
        [${PPHighlightIdAttr}]:hover
      `);
    for (const node of Array.from(nodes)) {
      for (const id of annotationIds) {
        const highlightId = resourceToHighlightId(AnnotationResourceType, id);
        if (node.matches(`[${PPHighlightIdAttr}="${highlightId}"]`)) {
          return true;
        }
      }
      for (const id of annotationRequestIds) {
        const highlightId = resourceToHighlightId(AnnotationRequestResourceType, id);
        if (node.matches(`[${PPHighlightIdAttr}="${highlightId}"]`)) {
          return true;
        }
      }
    }
    return false;
  }

  doesHoverOverWindow() {
    return Boolean(
      document.querySelectorAll(`
      .${this.rootHoverClass}:hover,
      .${this.rootHoverClass} :hover,
      .${PPViewerIndirectHoverClass}:hover,
      .${PPViewerIndirectHoverClass} :hover
    `).length,
    );
  }

  doesHover = () => {
    const mouseOver = this.doesHoverOverWindow() || this.doesHoverOverOwnHighlight();
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
    console.log('annotations1', this.props.annotationIds);
    console.log('annotations1', this.props.annotationRequestIds);
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
