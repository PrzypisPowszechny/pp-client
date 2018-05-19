import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { AnnotationPriorities } from '../../consts';
import { Popup } from 'semantic-ui-react';

import styles from './PriorityButton.scss';

interface IPriorityButtonProps {
  type: AnnotationPriorities;
  priority: AnnotationPriorities;
  tooltipText: string;
  onClick: (priority: AnnotationPriorities) => void;
  children: React.ReactChild;
}

export default class PriorityButton extends PureComponent<IPriorityButtonProps> {

  static defaultProps = {
    selected: false,
    className: '',
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
      tooltipText,
    } = this.props;

    const selected = priority === type;
    const style = this.priorities[type];
    const button = (
      <button
        className={classNames(styles.self, style, { [styles.selected]: selected })}
        onClick={this.handleClick}
      >
        {children}
      </button>
    );

    return (
      <Popup
        trigger={button}
        size="small"
        className="pp-ui small-padding single-long-line"
        inverted={false}
      >
        {tooltipText}
      </Popup>
    );
  }
}
