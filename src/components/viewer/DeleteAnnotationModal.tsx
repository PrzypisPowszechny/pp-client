import React from 'react';
import { connect } from 'react-redux';
import { deleteResource } from 'redux-json-api';
import { Button, Modal } from 'semantic-ui-react';

import { selectViewerState } from 'store/widgets/selectors';
import { hideViewerDeleteModal } from 'store/widgets/actions';
import { AnnotationAPIModel } from 'api/annotations';
import { PPScopeClass } from 'class_consts.ts';
import { mouseOverViewer } from 'store/widgets/actions';

interface IModalProps {
  deleteModalId: string;
  deleteModalOpen: boolean;

  annotations: AnnotationAPIModel[];

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  mouseOverViewer: (value: boolean) => void;
  hideViewerDeleteModal: () => void;
}

@connect(
  (state) => {
    const {
      deleteModal: {
        deleteModalId,
        deleteModalOpen,
      },
      annotations,
    } = selectViewerState(state);

    return {
      deleteModalId,
      deleteModalOpen,
      annotations,
    };
  },
  {
    mouseOverViewer,
    hideViewerDeleteModal,
    deleteAnnotation: deleteResource,
  },
)
export default class DeleteAnnotationModal extends React.Component<Partial<IModalProps>, {}> {

  handleConfirmDelete = (e) => {
    const annotation = this.props.annotations.find(a => a.id === this.props.deleteModalId);
    this.props.deleteAnnotation(annotation)
      .catch((errors) => {
        console.log(errors);
      });
  }

  handleCancel = (e) => {
    this.props.hideViewerDeleteModal();
    this.props.mouseOverViewer(false);
  }

  render() {
    return (
      <Modal
        size="mini"
        className={PPScopeClass}
        open={this.props.deleteModalOpen}
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
