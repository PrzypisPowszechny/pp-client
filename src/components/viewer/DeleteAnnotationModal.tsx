import React from 'react';
import { connect } from 'react-redux';
import { deleteResource } from 'redux-json-api';
import { Button, Modal } from 'semantic-ui-react';

import { selectAnnotation, selectViewerState } from 'store/widgets/selectors';
import { hideViewerDeleteModal } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass } from 'class_consts.ts';
import { setMouseOverViewer } from 'store/widgets/actions';

interface IModalProps {
  deleteModalId: string;
  isDeleteModalOpen: boolean;

  annotation: AnnotationAPIModel;

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  setMouseOverViewer: (value: boolean) => void;
  hideViewerDeleteModal: () => void;
}

@connect(
  (state) => {
    const {
      deleteModal: {
        deleteModalId,
        isDeleteModalOpen,
      },
    } = selectViewerState(state);

    return {
      deleteModalId,
      isDeleteModalOpen,
      annotation: selectAnnotation(state, deleteModalId),
    };
  },
  {
    setMouseOverViewer,
    hideViewerDeleteModal,
    deleteAnnotation: deleteResource,
  },
)
export default class DeleteAnnotationModal extends React.Component<Partial<IModalProps>, {}> {

  handleConfirmDelete = (e) => {
    this.props.deleteAnnotation(this.props.annotation)
      .catch((errors) => {
        console.log(errors);
      });
  }

  handleCancel = (e) => {
    this.props.hideViewerDeleteModal();
    this.props.setMouseOverViewer(false);
  }

  render() {
    return (
      <Modal
        size="mini"
        className={PPScopeClass}
        open={this.props.isDeleteModalOpen}
      >
        <Modal.Content>
          <p>Czy na pewno chcesz usunąć przypis?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleCancel} size="tiny" negative={true}>
            Nie
          </Button>
          <Button onClick={this.handleConfirmDelete} size="tiny" positive={true}>
            Tak
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

}
