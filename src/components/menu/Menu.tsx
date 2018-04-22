import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectMenuState } from 'store/selectors';

import Widget from 'components/widget';

import styles from './Menu.scss';
import {hideMenu, showEditorNewAnnotation} from 'store/widgets/actions';

interface IMenuProps {
  visible: boolean;
  locationX: number;
  locationY: number;

  showEditor: (x: number, y: number) => void;
  hideMenu: () => void;
}

@connect(
  (state) => {
  const {
    visible,
    locationX,
    locationY,
  } = selectMenuState(state);

  return {
    visible,
    locationX,
    locationY,
  };
},
  dispatch => ({
    showEditor: (x, y) => dispatch(showEditorNewAnnotation(x, y)),
    hideMenu: () => dispatch(hideMenu()),
  }),
)
export default class Menu extends React.Component<Partial<IMenuProps>, {}> {

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
  };

  constructor(props: IMenuProps) {
    super(props);
  }

  onClick = (e: any) => {
    console.log('heeej');
    this.props.hideMenu();
    this.props.showEditor(this.props.locationX, this.props.locationY);
  }

  render() {
    return (
      <Widget
        className={classNames('pp-ui', styles.self)}
        visible={this.props.visible}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
      >
        <button
          className={classNames(styles.createAnnotation, 'ui', 'basic', 'pointing', 'below', 'label', 'large')}
          onClick={this.onClick}
        >
          <i className="plus icon" />
          Dodaj przypis
        </button>
      </Widget>
    );
  }
}
