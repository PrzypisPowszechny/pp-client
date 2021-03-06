import React from 'react';

import { AnnotationPPCategories, annotationPPCategoriesLabels } from 'common/api/annotations';

import styles from './PPCategoryButtonsBar.scss';

import PPCategoryButton from '../PPCategoryButton/PPCategoryButton';

interface PPCategoryBarProps {
  ppCategory: AnnotationPPCategories;
  onSetPPCategory: (category: AnnotationPPCategories) => void;
}

export default class PPCategoryButtonsBar extends React.PureComponent<PPCategoryBarProps> {
  render() {
    const {
      onSetPPCategory,
      ppCategory,
    } = this.props;

    return (
      <div className={styles.self}>
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
