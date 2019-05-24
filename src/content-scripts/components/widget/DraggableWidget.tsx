import React, { RefObject } from 'react';

import { default as Widget } from './Widget';

import { default as DragTracker, IVec2 } from '../../utils/DragTracker';

export interface IDraggableWidgetProps {
  // Props consumed by DraggableWidget
  mover: RefObject<HTMLElement>;
  initialLocationX: number;
  initialLocationY: number;

  // Props passed to Widget
  children: any;
  widgetTriangle: boolean;
  className: string;
  onMoved?: () => void;
}

export interface IDraggableWidgetState {
  initialLocationX: number;
  initialLocationY: number;
  locationX: number;
  locationY: number;
  hasBeenDragged: boolean;
}

export default class DraggableWidget extends React.PureComponent<
    Partial<IDraggableWidgetProps>,
    Partial<IDraggableWidgetState>
  > {

  static defaultProps = {
    initialLocationX: 0,
    initialLocationY: 0,
  };

  static getDerivedStateFromProps(nextProps: IDraggableWidgetProps, prevState: IDraggableWidgetState) {
    // todo: this usage of getDerivedStateFromProps is discouraged
    // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
    const areInitialLocationsEqual =
      prevState.initialLocationX === nextProps.initialLocationX
      && prevState.initialLocationY === nextProps.initialLocationY;
    if (!areInitialLocationsEqual) {
      return {
        initialLocationX: nextProps.initialLocationX,
        initialLocationY: nextProps.initialLocationY,
        locationX: nextProps.initialLocationX,
        locationY: nextProps.initialLocationY,
        hasBeenDragged: false,
      };
    }
    return null;
  }

  dragTracker: DragTracker;

  constructor(props: IDraggableWidgetProps) {
    super(props);
    this.state = {};
  }

  onDrag = (delta: IVec2) => {
    this.setState({
      locationX: this.state.locationX + delta.x,
      locationY: this.state.locationY + delta.y,
      hasBeenDragged: true,
    });
    return true;
  }

  setupDragTracker() {
    const moverElement = this.props.mover.current;
    if (moverElement) {
      if (this.dragTracker) {
        this.dragTracker.destroy();
      }
      this.dragTracker = new DragTracker(moverElement, null, this.onDrag, this.props.onMoved);
    }
  }

  componentDidMount() {
    // called on the first render only
    this.setupDragTracker();
  }

  render() {
    const {
      widgetTriangle,
      className,
    } = this.props;

    const {
      locationX,
      locationY,
      hasBeenDragged,
    } = this.state;

    return (
      <Widget
        locationX={locationX}
        locationY={locationY}
        updateInverted={!hasBeenDragged}

        widgetTriangle={widgetTriangle}
        className={className}
      >
        {this.props.children}
      </Widget>
    );
  }
}
