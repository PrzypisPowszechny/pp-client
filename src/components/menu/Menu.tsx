import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectMenuState } from 'store/selectors';

import Widget from 'components/widget';

import styles from './Menu.scss';
import { hideMenu, setSelectionRange, showEditorAnnotation } from 'store/widgets/actions';
import { Range } from 'xpath-range';
import { PPScopeClass } from '../../class_consts';
import ppGA from '../../pp-ga';
import { AnnotationLocation } from '../../utils/annotations';

interface IMenuProps {
  locationX: number;
  locationY: number;
  range: Range.SerializedRange;
  text: string;

  setSelectionRange: (range: AnnotationLocation) => void;
  showEditor: (x: number, y: number) => void;
  hideMenu: () => void;
}

@connect(
  (state) => {
  const {
    locationX,
    locationY,
  } = selectMenuState(state);

  return {
    locationX,
    locationY,
    range: state.textSelector.range,
    text: state.textSelector.text,
  };
},
  {
    showEditor: showEditorAnnotation,
    setSelectionRange,
    hideMenu,
  },
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
      text,
    } = this.props;

    this.props.hideMenu();
    this.props.setSelectionRange({range, text});
    this.props.showEditor(locationX, locationY);
    ppGA.annotationAddFormDisplayed('addingModeMenu');
  }

  render() {
    return (
      <Widget
        className={classNames(PPScopeClass, styles.self)}
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
