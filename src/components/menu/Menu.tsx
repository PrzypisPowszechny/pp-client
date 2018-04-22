import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectMenuState } from 'store/selectors';

import Widget from 'components/widget';

import styles from './Menu.scss';
import {hideMenu, showEditorNewAnnotation} from 'store/widgets/actions';
import {Range} from 'xpath-range';

interface IMenuProps {
  visible: boolean;
  locationX: number;
  locationY: number;
  range: Range.SerializedRange;

  showEditor: (x: number, y: number, range: Range.SerializedRange) => void;
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
    range: state.textSelector.range,
  };
},
  dispatch => ({
    showEditor: (x, y, range) => dispatch(showEditorNewAnnotation(x, y, range)),
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
    const {
      locationX,
      locationY,
      range,
    } = this.props;

    this.props.hideMenu();
    this.props.showEditor(locationX, locationY, range);
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
