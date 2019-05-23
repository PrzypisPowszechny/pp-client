import React, { RefObject } from 'react';

import classNames from 'classnames';
import _isEqual from 'lodash/isEqual';

import { isInverted } from './utils';
import styles from './Widget.scss';

export interface IWidgetProps {
  locationX: number;
  locationY: number;
  invertedX: boolean;
  invertedY: boolean;
  /*
   * updateInverted - (overwrites invertedX and invertedY)
   * if true, the widget horizontal or vertical inversion will be calculated based on the window location
   * after the component is rendered for the first time after prop change
   */
  updateInverted: boolean;
  widgetTriangle: boolean;

  className: string;
  offsetClassName: string;

  // These handlers are not used now but are very handy for simple (not very nested) components
  onMouseLeave: (Event) => void;
  onMouseEnter: (Event) => void;

  children: React.ReactChild | React.ReactChild[];
}

interface IWidgetState {
  invertedX: boolean;
  invertedY: boolean;
  updateInverted: boolean;

  prevProps: Partial<IWidgetProps>;
}

export default class Widget extends React.PureComponent<Partial<IWidgetProps>,
  Partial<IWidgetState>> {
  /* Every time the component receives new props and  `updateInverted` is true, `invertedX` and `invertedY`
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
    locationX: 0,
    locationY: 0,
    invertedX: false,
    invertedY: false,
    updateInverted: false,
    className: '',
    offsetClassName: '',
    onMouseLeave: null,
    onMouseEnter: null,
    widgetTriangle: false,
    prevProps: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    /*
     * If updateInverted prop is set to true, invertedX and invertedY are set to false, so the initial measurements
     * may take place after the first render
    */
    //
    // this check is a universal quick fix to allow React 16.4 compatibility
    // according to https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops
    if (!_isEqual(prevState.prevProps, nextProps)) {
      let inverted;
      if (nextProps.updateInverted) {
        inverted = {
          invertedX: false,
          invertedY: false,
        };
      }
      return {
        prevProps: nextProps,
        ...inverted,
        updateInverted: nextProps.updateInverted,
      };
    }
    return null;
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
      styles.inner, {
        [styles.widgetTriangle]: this.props.widgetTriangle,
        [styles.invertX]: this.state.invertedX,
        [styles.invertY]: this.state.invertedY,
        [styles.updateInverted]: this.state.updateInverted,
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

  onMountedOrUpdated() {
    // Set the CSS left/top properties
    this.setLocationStyle();

    if (this.state.updateInverted) {
      this.setState({
        ...isInverted(this.innerElement.current, window),
        updateInverted: false,
      });
    } else {
      // once the component is all set (no need to invert it anymore), set up handlers

      const rootElement = this.rootElement.current;
      const { onMouseEnter, onMouseLeave } = this.props;
      if (rootElement) {
        if (onMouseLeave) {
          rootElement.addEventListener('mouseleave', onMouseLeave);
        }
        if (onMouseEnter) {
          rootElement.addEventListener('mouseenter', onMouseEnter);
        }
      }
      if (onMouseLeave) {
        document.addEventListener('mouseleave', onMouseLeave);
      }
    }
  }

  removeEventListeners() {
    const rootElement = this.rootElement.current;

    const { onMouseEnter, onMouseLeave } = this.props;
    if (rootElement) {
      if (onMouseLeave) {
        rootElement.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mouseleave', onMouseLeave);
      }
      if (onMouseEnter) {
        rootElement.removeEventListener('mouseenter', onMouseEnter);
      }
    }
    if (onMouseLeave) {
      document.removeEventListener('mouseleave', onMouseLeave);
    }
  }

  componentDidMount() {
    this.onMountedOrUpdated();
  }

  componentDidUpdate(prevProps, prevState) {
    this.onMountedOrUpdated();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  render() {
    return (
      <div
        className={classNames(styles.self, this.props.offsetClassName)}
        ref={this.rootElement}
      >
        <div
          className={this.getInnerClassNames()}
          ref={this.innerElement}
        >
          <div className={classNames(styles.content, this.props.className)}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
