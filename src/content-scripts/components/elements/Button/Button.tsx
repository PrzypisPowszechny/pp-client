import React from 'react';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';

import styles from './Button.scss';

interface ButtonProps {
  className: string;
  label: string;
  isDisabled: boolean;
  appearance: 'default' | 'primary' | 'subtle';
  onClick: (e: any) => void;
}

export default class Button extends React.Component <Partial<ButtonProps>, {}> {

  buttonAppearance = {
    default: styles.default,
    primary: styles.primary,
    subtle: styles.subtle,
  };

  render() {
    return (
      <button
        className={classNames(
          this.props.className,
          PPScopeClass,
          styles.self,
          this.buttonAppearance[this.props.appearance],
          { [styles.disabled]: this.props.isDisabled },
        )}
        onClick={this.props.onClick}
        disabled={this.props.isDisabled}
    >
      <span className={styles.buttonContent}>
        <span className={styles.label}>{this.props.children}</span>
      </span>
      </button>
    );
  }
}
