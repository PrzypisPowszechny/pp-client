import React, { PureComponent } from 'react';
import { Modal } from 'semantic-ui-react';
import { PPScopeClass } from '../../class-consts';

interface NoCommentModalProps {
  open: boolean;
  onCloseCommentModal: () => void;
  onModalSaveClick: () => void;
}

export default class NoCommentModal extends PureComponent<NoCommentModalProps> {
  render() {
    const {
      open,
      onCloseCommentModal,
      onModalSaveClick,
    } = this.props;

    return (

      <Modal size="mini" className={PPScopeClass} open={open}>
        <Modal.Content>
          Czy na pewno chcesz dodać przypis bez treści?
        </Modal.Content>
        {/* Action buttons style from semantic-ui, probably temporary */}
        <Modal.Actions>
          <button
            className="ui button negative"
            onClick={onCloseCommentModal}
          >
            Anuluj
          </button>
          <button
            className="ui button"
            onClick={onModalSaveClick}
          >
            Zapisz
          </button>
        </Modal.Actions>
      </Modal>
    );
  }
}
