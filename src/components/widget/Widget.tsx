import React, {RefObject} from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';

interface IWidgetProps {
  visible: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;
  className: string;
  children: React.ReactChild | React.ReactChild[];
}

export default class Widget extends React.Component<
  Partial<IWidgetProps>,
  {}
  > {

  static classes = {
    invertedX: 'inverted-x',
    invertedY: 'inverted-y',
  };

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
    className: '',
  };

  rootElement: RefObject<{}>;

  constructor(props: IWidgetProps) {
    super(props);
    this.rootElement = React.createRef();
  }

  getInnerClassNames() {
    return classNames(
      styles.inner,
      this.props.className,
      {
        [Widget.classes.invertedX]: this.props.invertedX,
        [Widget.classes.invertedY]: this.props.invertedY,
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
    // invoked on the first render
    this.setLocationStyle();
  }

  componentDidUpdate() {
    // invoked on all but the first render
    this.setLocationStyle();
  }

  render() {
    if (this.props.visible) {
      return (
      <div
        className={styles.self}
        ref={this.rootElement}
      >
        <div className={this.getInnerClassNames()}>
        {this.props.children}
        </div>
      </div>
    );
    } else {
      return null;
    }
  }
}
