import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Widget from 'components/widget';

import ViewerItem from './ViewerItem';
import styles from './Viewer.scss';
import {selectViewerState} from 'store/widgets/selectors';
import {hideViewer} from 'store/widgets/actions';

interface IViewerProps {
  visible: boolean;
  locationX: number;
  locationY: number;
  annotations: any[];
  hideViewer: () => void;
}

/*
 * TODO list
 * - [roadmap 6.1.4] the appear/disappear logic of Viewer is just a simulation and should be refined or
  * (preferably) straightforwardly adapted from old_src/ViewerWidget
 */
@connect(
  (state) => {
    const {
      visible,
      locationX,
      locationY,
      annotations,
    } = selectViewerState(state);

    return {
      visible,
      locationX,
      locationY,
      annotations,
    };
  },
  dispatch => ({
    hideViewer: () => dispatch(hideViewer()),
  }),
)
export default class Viewer extends React.Component<Partial<IViewerProps>, {}> {

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
    annotations: [],
  };

  constructor(props: IViewerProps) {
    super(props);
  }

  renderItems() {
    return this.props.annotations.map(annotation => (
      <ViewerItem
        key={annotation.annotationId}
        annotation={annotation}
      />
    ));
  }

  render() {
    return (
      <Widget
        className={classNames('pp-ui', styles.self)}
        visible={this.props.visible}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
        calculateInverted={true}
        onMouseLeave={this.props.hideViewer}
      >
        <ul className={styles.annotationItems}>
          {this.renderItems()}
        </ul>
      </Widget>
    );
  }
}
