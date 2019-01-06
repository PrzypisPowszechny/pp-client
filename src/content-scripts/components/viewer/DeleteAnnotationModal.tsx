import React from 'react';
import { connect } from 'react-redux';
import { deleteResource } from 'redux-json-api';
import { Button, Modal } from 'semantic-ui-react';

import { selectViewerState } from 'content-scripts/store/widgets/selectors';
import { hideViewerDeleteModal } from 'content-scripts/store/widgets/actions';
import { AnnotationAPIModel } from 'common/api/annotations';
import { PPScopeClass } from 'content-scripts/settings';
import { setMouseOverViewer } from 'content-scripts/store/widgets/actions';
import ppGA from 'common/pp-ga';
import { selectAnnotation } from '../../store/api/selectors';
import { changeNotification } from '../../store/widgets/actions';

interface IModalProps {
  deleteModalId: string;
  isDeleteModalOpen: boolean;

  annotation: AnnotationAPIModel;

  deleteAnnotation: (instance: AnnotationAPIModel) => Promise<object>;
  setMouseOverViewer: (value: boolean) => void;
  hideViewerDeleteModal: () => void;
  changeNotification: (visible: boolean, message?: string) => void;
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
    changeNotification,
    deleteAnnotation: deleteResource,
  },
)
export default class DeleteAnnotationModal extends React.Component<Partial<IModalProps>, {}> {

  handleConfirmDelete = (e) => {
    this.props.deleteAnnotation(this.props.annotation)
      .then(() => {
        const attrs = this.props.annotation.attributes;
        ppGA.annotationDeleted(this.props.annotation.id,  attrs.ppCategory, !attrs.comment, attrs.annotationLink);
        this.props.changeNotification(true, 'Usunięto przypis');
      })
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
