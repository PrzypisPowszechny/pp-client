import React, { PureComponent } from 'react';

import { AnnotationPriorities, annotationPrioritiesLabels } from 'api/annotations';

import PriorityButton from './priority-button/PriorityButton';
import styles from './PriorityButtonsBar.scss';

interface PriorityBarProps {
  priority: AnnotationPriorities;
  onSetPriority: (priority: AnnotationPriorities) => void;
}

export default class PriorityButtonsBar extends PureComponent<PriorityBarProps> {
  render() {
    const {
      onSetPriority,
      priority,
    } = this.props;

    return (
      <div className={styles.self}>
        <label className={styles.priorityHeader}> Co dodajesz? </label>
        <div className={styles.headerButtons}>
          <PriorityButton
            type={AnnotationPriorities.NORMAL}
            onClick={onSetPriority}
            priority={priority}
            tooltipText="Przypis nie jest niezbędny, ale może być użyteczny"
          >
            {annotationPrioritiesLabels.NORMAL}
          </PriorityButton>
          <PriorityButton
            type={AnnotationPriorities.WARNING}
            onClick={onSetPriority}
            priority={priority}
            tooltipText="Bez tego przypisu czytelnik może być wprowadzony w&nbsp;błąd"
          >
            {annotationPrioritiesLabels.WARNING}
          </PriorityButton>
          <PriorityButton
            type={AnnotationPriorities.ALERT}
            onClick={onSetPriority}
            priority={priority}
            tooltipText="Bez tego przypisu tekst wprowadzi w&nbsp;błąd!"
          >
            {annotationPrioritiesLabels.ALERT}
          </PriorityButton>
        </div>
      </div>
    );
  }
}
