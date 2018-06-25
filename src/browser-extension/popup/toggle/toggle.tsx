import React from 'react';

import './toggle.scss';

declare const chrome: any;

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
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={this.props.onChange}
        />
        <span className="slider round"/>
      </label>
    );
  }
}
