import React from 'react';
import classNames from 'classnames';

import { Popup } from 'semantic-ui-react';

import styles from './PPCategoryButton.scss';
import { PPScopeClass } from 'content-scripts/settings';
import { AnnotationPPCategories } from 'common/api/annotations';

interface IPPCategoryButtonProps {
  type: AnnotationPPCategories;
  ppCategory: AnnotationPPCategories;
  tooltipText: string;
  onClick: (category: AnnotationPPCategories) => void;
  children: React.ReactChild;
}

export default class PPCategoryButton extends React.PureComponent<IPPCategoryButtonProps> {

  static defaultProps = {
    selected: false,
    className: '',
  };

  ppCategories = {
    [AnnotationPPCategories.ADDITIONAL_INFO]: styles.categoryAdditionalInfo,
    [AnnotationPPCategories.CLARIFICATION]: styles.categoryClarification,
    [AnnotationPPCategories.ERROR]: styles.categoryError,
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
      ppCategory,
      children,
      tooltipText,
    } = this.props;

    const selected = ppCategory === type;
    const style = this.ppCategories[type];
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
        className={classNames(PPScopeClass, styles.tooltip, 'small-padding', 'single-long-line')}
        inverted={false}
      >
        {tooltipText}
      </Popup>
    );
  }
}
