import React from 'react';
import classNames from 'classnames';
import Widget from '../Widget';
import styles from './Editor.scss';

interface IEditorProps {
  visible?: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;
}

class Editor extends React.Component<
  IEditorProps,
  Partial<IEditorProps>
  > {

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
  };

  render() {
    return (
      <Widget
        className={classNames("pp-ui", styles.self)}
        visible={this.props.visible}
        invertedX={this.props.invertedX}
        invertedY={this.props.invertedY}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
      >
        To jest edytor!
      </Widget>
    );
  }

}

export default Editor
