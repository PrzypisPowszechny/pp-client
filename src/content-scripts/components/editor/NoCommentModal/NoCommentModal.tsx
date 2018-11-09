import React, { PureComponent } from 'react';
import { PPScopeClass } from 'content-scripts/settings';
import Modal from 'content-scripts/components/elements/Modal/Modal';
import classNames from 'classnames';
import styles from './NoCommentModal.scss';

interface NoCommentModalProps {
  onCloseCommentModal: () => void;
  onModalSaveClick: () => void;
}

export default class NoCommentModal extends PureComponent<NoCommentModalProps> {
  render() {
    const {
      onCloseCommentModal,
      onModalSaveClick,
    } = this.props;

    return (
      <Modal onCloseModal={onCloseCommentModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            Czy na pewno chcesz dodać przypis bez treści?
          </div>
          <div>
            <p className={styles.modalText}>
              Robocze copy: Treśc przypisu to miejsce na streszczenie najważniejszych informacji ze źrodła, które dodajesz albo zacytowanie wprost jego fragmentu.
            </p>
            <p className={styles.modalText}>
              Możesz nie wpisywac treści, jeśli chcesz podlinkowac tylko źródło do artykułu.
            </p>
          </div>
          <div className={styles.controls}>
            <button
              onClick={onCloseCommentModal}
              className={classNames(styles.modalButton, styles.cancel)}
            >
              Wróć
            </button>
            <button
              onClick={onModalSaveClick}
              className={classNames(styles.modalButton, styles.save)}
            >
              Dodaj przypis
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
