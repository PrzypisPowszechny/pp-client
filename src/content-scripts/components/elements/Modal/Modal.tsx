import React from 'react';

import classNames from 'classnames';

import styles from './Modal.scss';

import { PPScopeClass } from '../../../settings';

interface ModalProps {
  className?: string;
  onCloseModal: (e) => void;
}

export default class Modal extends React.PureComponent<ModalProps> {
  handleContentClick = (e) => {
    e.stopPropagation();
  }

  render() {
    return (
      <div
        className={classNames(PPScopeClass, styles.modal, this.props.className)}
        onClick={this.props.onCloseModal}
      >
        <div className={styles.modalContent} onClick={this.handleContentClick}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
