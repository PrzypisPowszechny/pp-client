import React from 'react';
import classNames from 'classnames';

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

  rootElement: any;

  constructor(props: IWidgetProps) {
    super(props);
    this.rootElement = React.createRef();
  }

  static classes = {
    invertedX: 'inverted-x',
    invertedY: 'inverted-y',
    visible: 'visible',
  };

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
    className: '',
  };

  getClassNames() {
    return classNames(
      this.props.className,
      {
        [Widget.classes.visible]: this.props.visible,
        [Widget.classes.invertedX]: this.props.invertedX,
        [Widget.classes.invertedY]: this.props.invertedY,
      }
    );
  }

  componentDidMount() {
    console.log(this.rootElement);
    console.log(this.props.locationX);
    console.log(this.props.locationY);
    this.rootElement.current.style.left = this.props.locationX +'px'
    this.rootElement.current.style.top = this.props.locationY + 'px'
  }

  render() {
    return (
      <div
        className={this.getClassNames()}
        ref={this.rootElement}
      >
        {this.props.children}
      </div>
    );
  }
}
