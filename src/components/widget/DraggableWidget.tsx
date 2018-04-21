import React, {ReactNode, RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';
import {isInverted} from './utils';
import {DragTracker, IVec2} from 'utils/move';
import {IWidgetState, IWidgetProps, default as Widget} from './Widget';

export interface IDraggableWidgetProps extends IWidgetProps {
  mover: RefObject<HTMLElement>;
}

export interface IDraggableWidgetState {
  locationX: number;
  locationY: number;
  moved: boolean;
}

export default class DraggableWidget extends React.PureComponent<
    Partial<IDraggableWidgetProps>,
    Partial<IDraggableWidgetState>
  > {

  static defaultProps = {
    ...Widget.defaultProps,
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      locationX: nextProps.locationX,
      locationY: nextProps.locationY,
      moved: false,
    };
  }

  dragTracker: DragTracker;

  constructor(props: IWidgetProps) {
    super(props);
    this.state = {};
  }

  onDrag = (delta: IVec2) => {
    this.setState({
      locationX: this.state.locationX + delta.x,
      locationY: this.state.locationY + delta.y,
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

  componentDidUpdate() {
    // called on all but the first render
    this.setupDragTracker();
  }

  render() {
    const {
      locationX,
      locationY,
      moved,
    } = this.state;

    return (
      <Widget
        {...this.props}
        locationX={locationX}
        locationY={locationY}
        calculateInverted={!moved}
      >
        {this.props.children}
      </Widget>
    )
  }
}
