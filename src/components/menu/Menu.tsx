import React from 'react';
import classNames from 'classnames';
import styles from './Menu.scss';
import Widget from "../widget/Widget";

interface IMenuProps {
  visible: boolean;
  locationX: number;
  locationY: number;
}

export default class Menu extends React.Component<
  Partial<IMenuProps>,
  {}
  > {

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
  };

  constructor(props: IMenuProps) {
    super(props);
  }

  private onClick(event: any) {
    // TODO
    console.log(event);
  }

  render() {
    return (
      <Widget
        className={classNames("pp-ui", styles.self)}
        visible={this.props.visible}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
      >
        <button
          className={classNames(styles.createAnnotation, 'ui', 'basic', 'pointing', 'below', 'label', 'large')}
          onClick={this.onClick}
        >
          <i className="plus icon"></i>
            Dodaj przypis
        </button>
      </Widget>
    );
  }
}
