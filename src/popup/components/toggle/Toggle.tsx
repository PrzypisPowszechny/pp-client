import React from 'react';

import classNames from 'classnames';

import styles from './Toggle.scss';

interface IToggleProps {
  checked: boolean;
  onChange: (Event) => void;
}

export default class Toggle extends React.Component<IToggleProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const { checked } = this.props;
    return (
      <label className={styles.self}>
        <input
          type="checkbox"
          checked={checked}
          onChange={this.props.onChange}
        />
        <span className={classNames(styles.slider, styles.round)}/>
      </label>
    );
  }
}
