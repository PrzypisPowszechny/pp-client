import React from 'react';
import classNames from 'classnames';
import styles from './Widget.scss';

interface IWidgetProps {
  visible: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;
  className: string;
  children: React.ReactChild;
}

export default class Widget extends React.Component<
  IWidgetProps,
  Partial<IWidgetProps>
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

  rootElement: any;

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
    if (this.props.visible) {
    } else {
      return null;
    }
  }
}
