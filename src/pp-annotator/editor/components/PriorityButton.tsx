import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { AnnotationPriorities } from '../../consts';

import styles from './PriorityButton.scss';

interface IPriorityButtonProps {
  type: AnnotationPriorities;
  priority: AnnotationPriorities;
  onClick: (priority: AnnotationPriorities) => void;
  children: React.ReactChild;
}

export default class PriorityButton extends PureComponent<IPriorityButtonProps> {

  static defaultProps = {
    selected: false,
  };

  priorities = {
    [AnnotationPriorities.NORMAL]: styles.normal,
    [AnnotationPriorities.WARNING]: styles.warning,
    [AnnotationPriorities.ALERT]: styles.alert,
  };

  handleClick = () => {
    const {
      type,
      onClick,
    } = this.props;

    onClick(type);
  }

  render() {
    const {
      type,
      priority,
      children,
    } = this.props;

    const selected = priority === type;
    const style = this.priorities[type];

    return (
      <button
        className={classNames(styles.self, style, { [styles.selected]: selected })}
        onClick={this.handleClick}
      >
        {children}
      </button>
    );
  }
}
