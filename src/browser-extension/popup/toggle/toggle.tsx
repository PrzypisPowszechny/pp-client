import React from 'react';

import './toggle.scss';

declare const chrome: any;

export default class Toggle extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <label class="switch">
        <input type="checkbox" />
        <span class="slider round"></span>
      </label>
    );
  }
}
