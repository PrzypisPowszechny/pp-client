import React, {RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';
import {isInverted} from './utils';

interface IWidgetProps {
  visible: boolean;
  locationX: number;
  locationY: number;
  invertedX: boolean;
  invertedY: boolean;
  /*
   * calculateInverted - (overwrites invertedX and invertedY)
   * if true, the widget horizontal or vertical inversion will be calculated based on the window location
   * after the component is rendered for the first time after prop change
   */
  calculateInverted: boolean;
  className: string;
  children: React.ReactChild | React.ReactChild[];
}

interface IWidgetState {
  invertedX: boolean;
  invertedY: boolean;
  calculateInverted: boolean;
}

export default class Widget extends React.PureComponent<Partial<IWidgetProps>,
  Partial<IWidgetState>> {
  /* Every time the component receives new props and  `calculateInverted` is true, `invertedX` and `invertedY`
   * will be calculated based on the `locationX` and `locationY` props so the component is fully visible in the window
   *
   * NOTE:
   * This is a rough solution, probably not very maintainable in the long run
   * We should consider changing it in the near future, when the Widget/Editor behaviour needs to be extended
   *
   * However, it does have a very concrete advantage
   * - it makes no assumptions whatsoever about the size of the window;
   * the size of the window can be calculated in the runtime;
   * the component will deal with whatever is actually rendered to appear fully in the screen
   * The widget's inner containter must simply fit the browser window, or it will be inverted.
   *
   * If we undertake to change this component behaviour, it should only be with a clear benefit in mind,
   * that outweighs current flexibility
   */

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
    invertedX: false,
    invertedY: false,
    calculateInverted: false,
    className: '',
  };

  static getDerivedStateFromProps(nextProps: IWidgetProps) {
    /*
     * If calculateInverted prop is set to true, invertedX and invertedY are set to false, so the initial measurements
     * may take place after the first render
    */
    let inverted;
    if (nextProps.calculateInverted) {
      inverted = {
        invertedX: false,
        invertedY: false,
      };
    }
    return {
      ...inverted,
      calculateInverted: nextProps.calculateInverted,
    };
  }

  rootElement: RefObject<HTMLDivElement>;
  innerElement: RefObject<HTMLDivElement>;

  constructor(props: IWidgetProps) {
    super(props);
    this.state = {};
    this.rootElement = React.createRef();
    this.innerElement = React.createRef();
  }

  getInnerClassNames() {
    return classNames(
      styles.inner,
      this.props.className,
      {
        [styles.invertX]: this.state.invertedX,
        [styles.invertY]: this.state.invertedY,
        [styles.calculateInverted]: this.state.calculateInverted,
      },
    );
  }

  setLocationStyle() {
    const widget = this.rootElement.current;
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
        ...isInverted(this.innerElement.current, window),
        calculateInverted: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Set the CSS left/top properties
    this.setLocationStyle();
    if (this.state.calculateInverted) {
      this.setState({
        ...isInverted(this.innerElement.current, window),
        calculateInverted: false,
      });
    }
  }

  render() {
    if (this.props.visible) {
      return (
        <div
          className={styles.self}
          ref={this.rootElement}
        >
          <div
            className={this.getInnerClassNames()}
            ref={this.innerElement}
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
