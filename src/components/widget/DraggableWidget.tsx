import React, {ReactNode, RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';
import {isInverted} from './utils';
import {DragTracker, IVec2} from 'utils/move';
import {IWidgetState, IWidgetProps, default as Widget} from './Widget';

export interface IDraggableWidgetProps {
  // Props consumed by DraggableWidget
  mover: RefObject<HTMLElement>;
  initialLocationX: number;
  initialLocationY: number;

  // Props passed to Widget
  children: any;
  widgetTriangle: boolean;
  className: string;
}

export interface IDraggableWidgetState {
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
  dragTracker: DragTracker;

  constructor(props: IDraggableWidgetProps) {
    super(props);
    this.state = {
      locationX: props.initialLocationX,
      locationY: props.initialLocationY,
      hasBeenDragged: false,
    };
    console.log(this.state);
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
      this.dragTracker = new DragTracker(moverElement, null, this.onDrag, null);
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
