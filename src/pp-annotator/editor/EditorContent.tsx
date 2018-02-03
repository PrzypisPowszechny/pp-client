import React, { Component } from 'react';
import classNames from 'classnames';
import { Popup, Modal } from 'semantic-ui-react';

import {AnnotationPriorities, annotationPrioritiesLabels} from '../consts';
import AnnotationViewModel from '../annotation/AnnotationViewModel';
import { IAnnotationEditableFields } from '../annotation/annotation';

import PriorityButton from './components/PriorityButton';

import styles from './EditorContent.scss';

const savedFields = ['priority', 'comment', 'referenceLink', 'referenceLinkTitle'];

export interface IEditorContentProps {
  id: number;
  annotation: AnnotationViewModel;
  saveAction(annotation: AnnotationViewModel): any;
  onSave(e: any): any;
  onCancel(e: any): any;
}

export interface IEditorContentState extends IAnnotationEditableFields {
  referenceLinkError: string;
  referenceLinkTitleError: string;
  noCommentModalOpen: boolean;
  [key: string]: any;
}

function sliceKeys(dictionary: any, keys: string[]) {
  const result: {
    [x: string]: any;
  } = {};
  keys.forEach((key) => {
    result[key] = dictionary[key];
  });
  return result;
}

function getFormState(obj: any) {
  return sliceKeys(obj, savedFields) as IEditorContentState;
}

const priorityToClass = {
  [AnnotationPriorities.NORMAL]: 'priority-normal',
  [AnnotationPriorities.WARNING]: 'priority-warning',
  [AnnotationPriorities.ALERT]: 'priority-alert',
};

export default class EditorContent extends Component<IEditorContentProps, IEditorContentState> {

  static stateFromProps(props: IEditorContentProps): IEditorContentState {
    const annotation = props.annotation;
    return {
      priority: annotation.priority || AnnotationPriorities.NORMAL,
      comment: annotation.comment || '',
      referenceLink: annotation.referenceLink || '',
      referenceLinkError: '',
      referenceLinkTitle: annotation.referenceLinkTitle || '',
      referenceLinkTitleError: '',
      noCommentModalOpen: false,
    };
  }

  noCommentModal: React.ReactNode;
  commentInput: HTMLTextAreaElement;

  constructor(props: IEditorContentProps) {
    super(props);
    this.state = EditorContent.stateFromProps(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.executeSave = this.executeSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    // Set focus after a tiny timeout; needed at least for Chrome
    setTimeout(() => this.commentInput.focus(), 20);
  }

  componentWillUpdate(nextProps: IEditorContentProps, nextState: Partial<IEditorContentState>) {
    // Whenever the field has changed, eradicate the error message
    if (nextState.referenceLink) {
      nextState.referenceLinkError = '';
    }
    if (nextState.referenceLinkTitle) {
      nextState.referenceLinkTitleError = '';
    }
  }

  hideIfEmpty(value?: string): string {
    if (!value) {
      return ' pp-hide';
    } else {
      return '';
    }
  }

  saveButtonClass(): string {
    return priorityToClass[this.state.priority];
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

  // A modal displayed when user tries to save the form with comment field empty
  renderNoCommentModal() {
    this.noCommentModal = (
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
    return this.noCommentModal;
  }

  render() {
    const {
      priority,
      comment,
      referenceLink,
      referenceLinkError,
      referenceLinkTitle,
      referenceLinkTitleError,
    } = this.state;

    return (
      <div className={classNames('pp-widget', styles.self)}>
        <div className="pp-editor-head-bar">
          <label className="priority-header"> Co dodajesz? </label>
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
          className="pp-close"
          onClick={this.onCancel}
        >
          <i className="remove icon"/>
        </div>
        <div className="editor-input pp-comment">
          <textarea
            name="comment"
            value={comment}
            onChange={this.handleInputChange}
            placeholder="Dodaj treść przypisu"
            ref={(input) => { this.commentInput = input as HTMLTextAreaElement; }}
          />
        </div>
        <div className="editor-input pp-reference-link">
          <input
            type="text"
            name="referenceLink"
            className={referenceLinkError ? ' error' : ''}
            value={referenceLink}
            onChange={this.handleInputChange}
            placeholder="Wklej link do źródła"
          />
          <i className="input-icon linkify icon"/>
          <div
            className={'pp-error-msg ui pointing red basic label large' + this.hideIfEmpty(referenceLinkError)}
          >
            {referenceLinkError}
          </div>
        </div>
        <div className={'editor-input pp-reference-link-title'}>
          <input
              type="text"
              name="referenceLinkTitle"
              className={this.state.referenceLinkTitleError ? ' error' : ''}
              value={referenceLinkTitle}
              onChange={this.handleInputChange}
              placeholder="Wpisz tytuł źródła"
          />
          <i className="input-icon tags icon"/>
          <div
              className={'pp-error-msg ui pointing red basic label large' + this.hideIfEmpty(referenceLinkTitleError)}
          >
            {referenceLinkTitleError}
          </div>
          <Popup
              className="pp-ui small-padding"
              hideOnScroll={true}
              trigger={<div className="link-help"><i className="help circle icon"/></div>}
              flowing={true}
              hoverable={true}
          >
            np. <i>Treść ustawy</i>, <i>Wikipedia</i>,<br/> <i>Nagranie wypowiedzi ministra</i>
          </Popup>
        </div>
        <div className="pp-bottom-bar">
          <div className="pp-mover-area">
            <img className="mover-icon"/>
          </div>
          <div className="pp-controls">
            <button className="pp-cancel" onClick={this.onCancel}>
              {' '}Anuluj{' '}
            </button>
            <button className={'pp-save annotator-focus ' + this.saveButtonClass()} onClick={this.onSave}>
              {' '}Zapisz{' '}
            </button>
            {this.renderNoCommentModal()}
          </div>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(newProps: IEditorContentProps) {
    this.setState(EditorContent.stateFromProps(newProps));
  }

  private handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;
    const name = target.name;
    this.setState({ [name]: target.value });
  }

  private validateForm(): boolean {
    if (!this.state.referenceLink) {
      this.setState({ referenceLinkError: 'Musisz podać źródło, jeśli chcesz dodać przypis!' });
      return false;
    }
    if (!this.state.referenceLinkTitle) {
      this.setState({ referenceLinkTitleError: 'Musisz podać tytuł źródła, jeśli chcesz dodać przypis!' });
      return false;
    }

    return true;
  }

  private onSave(event: any) {
    // Copy form fields onto (much larger) view model before executing saveAction
    Object.assign(this.props.annotation, getFormState(this.state));
    if (this.validateForm()) { // if form values are correct
      if (!this.state.comment) { // if comment field is empty, display the modal
        this.setState({ noCommentModalOpen: true });
        return;
      }
      this.executeSave(event);
    }
  }

  private executeSave(event: any) {
    const saveResult = this.props.saveAction(this.props.annotation);
    Promise.resolve(saveResult)     // it will work whether result is a Promise or a value
      .then((result) => {
        const errors = result.errors;
        if (errors) {
          // TODO handle form validation messages here

        } else {
          this.props.onSave(event);
        }
      });
    this.setState({ noCommentModalOpen: false });
  }

  private onCancel(event: any) {
    this.props.onCancel(event);
  }
}
