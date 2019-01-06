import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { selectMenuState } from 'content-scripts/store/selectors';
import { hideMenu, setSelectionRange, showEditorAnnotation } from 'content-scripts/store/widgets/actions';
import { Range as XPathRange } from 'xpath-range';
import { AnnotationLocation } from '../../handlers/annotation-event-handlers';

import Widget from 'content-scripts/components/widget';

import styles from './Menu.scss';
import { PPScopeClass } from 'content-scripts/settings';
import { Icon } from 'react-icons-kit';
import { ic_add_circle } from 'react-icons-kit/md/ic_add_circle';

import ppGA from 'common/pp-ga';

interface IMenuProps {
  locationX: number;
  locationY: number;
  annotationLocation: AnnotationLocation;

  setSelectionRange: (range: AnnotationLocation) => void;
  showEditor: (x: number, y: number) => void;
  hideMenu: () => void;
}

@connect(
  (state) => {
  const {
    locationX,
    locationY,
    annotationLocation,
  } = selectMenuState(state);

  return {
    locationX,
    locationY,
    annotationLocation,
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
      annotationLocation,
    } = this.props;

    this.props.hideMenu();
    this.props.setSelectionRange(annotationLocation);
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
        <div
          className={classNames(styles.createAnnotation)}
          onClick={this.onClick}
        >
          <Icon className={styles.icon} icon={ic_add_circle} size={18}/>
          <span> Dodaj przypis </span>
        </div>
      </Widget>
    );
  }
}
