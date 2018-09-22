import React, { PureComponent } from 'react';

import { AnnotationPPCategories, annotationPPCategoriesLabels } from 'api/annotations';

import PPCategoryButton from './pp-category-button/PPCategoryButton';
import styles from './PPCategoryButtonsBar.scss';

interface PPCategoryBarProps {
  ppCategory: AnnotationPPCategories;
  onSetPPCategory: (category: AnnotationPPCategories) => void;
}

export default class PPCategoryButtonsBar extends PureComponent<PPCategoryBarProps> {
  render() {
    const {
      onSetPPCategory,
      ppCategory,
    } = this.props;

    return (
      <div className={styles.self}>
        <label className={styles.priorityHeader}> Co dodajesz? </label>
        <div className={styles.headerButtons}>
          <PPCategoryButton
            type={AnnotationPPCategories.ADDITIONAL_INFO}
            onClick={onSetPPCategory}
            ppCategory={ppCategory}
            tooltipText="Przypis nie jest niezbędny, ale może być użyteczny"
          >
            {annotationPPCategoriesLabels.ADDITIONAL_INFO}
          </PPCategoryButton>
          <PPCategoryButton
            type={AnnotationPPCategories.CLARIFICATION}
            onClick={onSetPPCategory}
            ppCategory={ppCategory}
            tooltipText="Bez tego przypisu czytelnik może być wprowadzony w&nbsp;błąd"
          >
            {annotationPPCategoriesLabels.CLARIFICATION}
          </PPCategoryButton>
          <PPCategoryButton
            type={AnnotationPPCategories.ERROR}
            onClick={onSetPPCategory}
            ppCategory={ppCategory}
            tooltipText="Bez tego przypisu tekst wprowadzi w&nbsp;błąd!"
          >
            {annotationPPCategoriesLabels.ERROR}
          </PPCategoryButton>
        </div>
      </div>
    );
  }
}
