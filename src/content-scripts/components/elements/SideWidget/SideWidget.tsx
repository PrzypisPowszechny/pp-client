import React from 'react';
import { chevronLeft } from 'react-icons-kit/feather/chevronLeft';
import { chevronRight } from 'react-icons-kit/feather/chevronRight';
import { Icon } from 'react-icons-kit/Icon';

import classNames from 'classnames';

import { PPScopeClass } from 'content-scripts/settings';

import styles from './SideWidget.scss';

interface SideWidgetState {
    collapsed: boolean;
  }

export default class SideWidget extends React.Component <{}, Partial<SideWidgetState>> {
    constructor(props: {}) {
        super(props);
        this.state = { collapsed: false };
      }

  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, { [styles.collapsed]: this.state.collapsed })}>
        <div>
          <button className={styles.collapseButton} onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
            <Icon className={styles.collapseIcon} icon={this.state.collapsed ? chevronLeft : chevronRight} size={16}/>
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }
}
