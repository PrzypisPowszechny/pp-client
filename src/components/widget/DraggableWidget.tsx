import React, {ReactNode, RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';
import {isInverted} from './utils';
import {DragTracker, IVec2} from 'utils/move';
import {IWidgetState, IWidgetProps, default as Widget} from './Widget';

export interface IDraggableWidgetProps extends IWidgetProps {
  mover: RefObject<HTMLElement>;
  onDrag: (delta: IVec2) => void;
}

export default class DraggableWidget extends React.PureComponent<
    Partial<IDraggableWidgetProps>,
  {}
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
    if (this.props.onDrag) {
      this.props.onDrag(delta);
    }
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
    return (
      <Widget
        {...this.props}
      >
        {this.props.children}
      </Widget>
    );
  }
}
