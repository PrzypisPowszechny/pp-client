import React, {RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';
import Editor from "../editor/Editor";
import {isInverted} from "./utils";

interface IWidgetProps {
  visible: boolean;
  locationX: number;
  locationY: number;
  invertedX: boolean;
  invertedY: boolean;
  calculateInverted: boolean;
  className: string;
  children: React.ReactChild | React.ReactChild[];
}

interface IWidgetState {
  invertedX: boolean;
  invertedY: boolean;
  calculateInverted: boolean;
}

export default class Widget extends React.Component<Partial<IWidgetProps>,
  Partial<IWidgetState>> {
  // `invertedX` and `invertedY` can be specified as props
  // every time the component receives new props and  `calculateInverted` is true, `invertedX` and `invertedY`
  // will be calculated based on the locationX and locationY props so the component is fully visible in the window

  static classes = {
    invertedX: 'invert-x',
    invertedY: 'invert-y',
    calculateInverted: 'calculate-inverted',
  };

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
    invertedX: false,
    invertedY: false,
    calculateInverted: false,
    className: '',
  };

  static newState(props: IWidgetProps) {
    /*
     * If calculateInverted prop is set to true, invertedX and invertedY are set to false, so the initial measurements
     * may take place after the first render
    */
    let inverted;
    if (props.calculateInverted) {
      inverted = {
        invertedX: false,
        invertedY: false,
      };
    }
    return {
      ...inverted,
      calculateInverted: props.calculateInverted,
    };
  }

  rootElement;
  innerElement;

  constructor(props: IWidgetProps) {
    super(props);
    this.state = Widget.newState(props);
  }

  componentWillReceiveProps(props: IWidgetProps) {
    this.setState(Widget.newState(props));
  }

  getInnerClassNames() {
    return classNames(
      styles.inner,
      this.props.className,
      {
        [Widget.classes.invertedX]: this.state.invertedX,
        [Widget.classes.invertedY]: this.state.invertedY,
        [Widget.classes.calculateInverted]: this.state.calculateInverted,
      },
    );
  }

  setLocationStyle() {
    const widget = this.rootElement;
    if (widget) {
      widget.style.left = this.props.locationX + 'px';
      widget.style.top = this.props.locationY + 'px';
    }
  }

  componentDidMount() {
    // Set the CSS left/top properties
    this.setLocationStyle();

    if (this.state.calculateInverted) {
      this.setState({
        ...isInverted(this.innerElement, window),
        calculateInverted: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Set the CSS left/top properties
    this.setLocationStyle();
    if (this.state.calculateInverted) {
      this.setState({
        ...isInverted(this.innerElement, window),
        calculateInverted: false,
      });
    }
  }

  render() {
    if (this.props.visible) {
      return (
        <div
          className={styles.self}
          ref={ref => this.rootElement = ref}
        >
          <div
            className={this.getInnerClassNames()}
            ref={ref => this.innerElement = ref}
          >
            {this.props.children}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
