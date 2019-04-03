import React from 'react';
import Modal from 'content-scripts/components/elements/Modal/Modal';
import classNames from 'classnames';
import styles from './NoCommentModal.scss';
import Button from '../../elements/Button/Button';

interface NoCommentModalProps {
  onCloseCommentModal: () => void;
  onModalSaveClick: () => void;
}

export default class NoCommentModal extends React.PureComponent<NoCommentModalProps> {
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
              Treść przypisu to miejsce na streszczenie najważniejszych informacji ze źrodła
              albo zacytowanie wprost jego fragmentu.
            </p>
            <p className={styles.modalText}>
              Możesz nie wpisywac treści, jeśli chcesz podlinkowac tylko źródło do artykułu.
            </p>
          </div>
          <div className={styles.controls}>
            <Button onClick={onCloseCommentModal}>
              Wróć
            </Button>
            <Button appearance="primary" onClick={onModalSaveClick}>
              Tak, dodaj przypis
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
