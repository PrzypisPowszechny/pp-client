import React, {RefObject} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {selectEditorState} from 'store/selectors';

import {AnnotationPriorities, annotationPrioritiesLabels} from '../consts';
import styles from './Editor.scss';
import {DragTracker, IVec2} from '../../utils/move';
import PriorityButton from './priority-button/PriorityButton';
import {Modal, Popup} from 'semantic-ui-react';
import Widget from '../widget/Widget';
import {IEditorState, IEditorProps} from './interfaces';
import { DraggableWidget } from 'components/widget';

@connect((state) => {
  const {
    visible,
    locationX,
    locationY,
    // form
    annotationId,
    priority,
    comment,
    referenceLink,
    referenceLinkTitle,
  } = selectEditorState(state);

  return {
    visible,
    locationX,
    locationY,
    // form
    annotationId,
    priority,
    comment,
    referenceLink,
    referenceLinkTitle,
  };
})
class Editor extends React.Component<
  Partial<IEditorProps>,
  Partial<IEditorState>
  > {
   /*
    * NOTE:
    * For a comprehensive note on invertedX and invertedY see Widget component
    */

  static defaultProps = {
    visible: true,
    locationX: 0,
    locationY: 0,
  };

  static priorityToClass = {
    [AnnotationPriorities.NORMAL]: styles.priorityNormal,
    [AnnotationPriorities.WARNING]: styles.priorityWarning,
    [AnnotationPriorities.ALERT]: styles.priorityAlert,
  };

  static getDerivedStateFromProps(nextProps: IEditorProps) {
    return {
      annotationId: nextProps.annotationId,
      priority: nextProps.priority,
      comment: nextProps.comment,
      referenceLink: nextProps.referenceLink,
      referenceLinkTitle: nextProps.referenceLinkTitle,

      locationX: nextProps.locationX,
      locationY: nextProps.locationY,
      referenceLinkError: '',
      referenceLinkTitleError: '',
      noCommentModalOpen: false,
    };
  }

  moverElement: RefObject<HTMLDivElement>;

  constructor(props: IEditorProps) {
    super(props);
    this.state = {};
    this.moverElement = React.createRef();
  }

  isNewAnnotation() {
    return this.props.annotationId !== null;
  }

  setPriority = (priority: AnnotationPriorities) => {
    this.setState({
      priority,
    });
  }

  setModalOpen = () => {
    this.setState({
      noCommentModalOpen: false,
    });
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = {[target.name]: target.value};

    // Whenever the field has changed, eradicate the error message
    if (stateUpdate.referenceLink) {
      stateUpdate.referenceLinkError = '';
    }
    if (stateUpdate.referenceLinkTitle) {
      stateUpdate.referenceLinkTitleError = '';
    }
    this.setState(stateUpdate);
  }

  validateForm(): boolean {
    if (!this.state.referenceLink) {
      this.setState({referenceLinkError: 'Musisz podać źródło, jeśli chcesz dodać przypis!'});
      return false;
    }
    if (!this.state.referenceLinkTitle) {
      this.setState({referenceLinkTitleError: 'Musisz podać tytuł źródła, jeśli chcesz dodać przypis!'});
      return false;
    }
    return true;
  }

  saveButtonClass(): string {
    return Editor.priorityToClass[this.state.priority];
  }

  onSave = (event: any) => {
    // copied from old_src; TODO review
    if (this.validateForm()) { // if form values are correct
      if (!this.state.comment) { // if comment field is empty, display the modal
        this.setState({noCommentModalOpen: true});
        return;
      }
      this.executeSave(event);
    }
  }

  onCancel = (event: any) => {
    // TODO
  }

  executeSave = (event: any) => {
    // TODO
  }

  // A modal displayed when user tries to save the form with comment field empty
  renderNoCommentModal() {
    return (
      <Modal
        size="mini"
        className="pp-ui"
        open={this.state.noCommentModalOpen}
      >
        <Modal.Content>
          Czy na pewno chcesz dodać przypis bez treści?
        </Modal.Content>
        {/* Action buttons style from semantic-ui, probably temporary */}
        <Modal.Actions>
          <button
            className="ui button negative"
            onClick={this.setModalOpen}
          >
            Anuluj
          </button>
          <button
            className="ui button"
            onClick={this.executeSave}
          >
            Zapisz
          </button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    const {
      locationX,
      locationY,
      priority,
      comment,
      referenceLink,
      referenceLinkError,
      referenceLinkTitle,
      referenceLinkTitleError,
    } = this.state;

    const {
      visible,
    } = this.props;

    return (
      <DraggableWidget
        className={classNames('pp-ui', styles.self)}
        visible={visible}
        locationX={locationX}
        locationY={locationY}
        mover={this.moverElement}
      >
        <div className={styles.headBar}>
          <label className={styles.priorityHeader}> Co dodajesz? </label>
          <div className={styles.headerButtons}>
            <PriorityButton
              type={AnnotationPriorities.NORMAL}
              onClick={this.setPriority}
              priority={priority}
              tooltipText="Przypis nie jest niezbędny, ale może być użyteczny"
            >
              {annotationPrioritiesLabels.NORMAL}
            </PriorityButton>
            <PriorityButton
              type={AnnotationPriorities.WARNING}
              onClick={this.setPriority}
              priority={priority}
              tooltipText="Bez tego przypisu czytelnik może być wprowadzony w&nbsp;błąd"
            >
              {annotationPrioritiesLabels.WARNING}
            </PriorityButton>
            <PriorityButton
              type={AnnotationPriorities.ALERT}
              onClick={this.setPriority}
              priority={priority}
              tooltipText="Bez tego przypisu tekst wprowadzi w&nbsp;błąd!"
            >
              {annotationPrioritiesLabels.ALERT}
            </PriorityButton>
          </div>
        </div>
        <div
          className={styles.close}
          onClick={this.onCancel}
        >
          <i className="remove icon" />
        </div>
        <div className={classNames(styles.editorInput, styles.comment)}>
          <textarea
            autoFocus={true}
            name="comment"
            value={comment}
            onChange={this.handleInputChange}
            placeholder="Dodaj treść przypisu"
          />
        </div>
        <div className={classNames(styles.editorInput, styles.referenceLink)}>
          <input
            type="text"
            name="referenceLink"
            className={referenceLinkError ? styles.error : ''}
            value={referenceLink}
            onChange={this.handleInputChange}
            placeholder="Wklej link do źródła"
          />
          <i className={classNames(styles.inputIcon, 'linkify', 'icon')} />
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: referenceLinkError === '' })}
          >
            {referenceLinkError}
          </div>
        </div>
        <div className={classNames(styles.editorInput, styles.referenceLinkTitle)}>
          <input
            type="text"
            name="referenceLinkTitle"
            className={referenceLinkTitleError ? styles.error : ''}
            value={referenceLinkTitle}
            onChange={this.handleInputChange}
            placeholder="Wpisz tytuł źródła"
          />
          <i className={classNames(styles.inputIcon, 'tags', 'icon')} />
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: referenceLinkTitleError === '' })}
          >
            {referenceLinkTitleError}
          </div>
          <Popup
            className="pp-ui small-padding"
            hideOnScroll={true}
            trigger={<div className={styles.linkHelp}><i className="help circle icon" /></div>}
            flowing={true}
            hoverable={true}
          >
            np. <i>Treść ustawy</i>, <i>Wikipedia</i>,<br /> <i>Nagranie wypowiedzi ministra</i>
          </Popup>
        </div>
        <div className={styles.bottomBar}>
          <div
            className={styles.moverArea}
            ref={this.moverElement}
          >
            <div className={styles.controls}>
              <button className={styles.cancel} onClick={this.onCancel}>
                {' '}Anuluj{' '}
              </button>
              <button className={classNames(styles.save, this.saveButtonClass())} onClick={this.onSave}>
                {' '}Zapisz{' '}
              </button>
              {this.renderNoCommentModal()}
            </div>
          </div>
          <img className={styles.moverIcon} />
        </div>
      </DraggableWidget>
    );
  }

}

export default Editor;
