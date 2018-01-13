import React, { Component } from 'react';
import classNames from 'classnames';
import { Header, Popup, Grid, Modal } from 'semantic-ui-react';

import { AnnotationPriorities } from '../consts';
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
        open={this.state.noCommentModalOpen}
        size="mini"
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
          <Popup
            on="click"
            hideOnScroll={true}
            trigger={<div className="priority-help"><i className="help circle icon"/></div>}
            flowing={true}
            hoverable={true}
          >
            {/*TODO just an instruction stub*/}
            <Grid centered={true} divided={true} columns={3}>
              <Grid.Column textAlign="center">
                <Header as="h4">Niebieski przypis</Header>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Header as="h4">Żółty przypis</Header>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Header as="h4">Pomarańczowy przypis</Header>
              </Grid.Column>
            </Grid>
          </Popup>
          <div className={styles.headerButtons}>
            <PriorityButton type={AnnotationPriorities.NORMAL} onClick={this.setPriority} priority={priority}>
              dodatkowa informacja
            </PriorityButton>
            <PriorityButton type={AnnotationPriorities.WARNING} onClick={this.setPriority} priority={priority}>
              wyjaśnienie
            </PriorityButton>
            <PriorityButton type={AnnotationPriorities.ALERT} onClick={this.setPriority} priority={priority}>
              sprostowanie błędu
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
        <div className="pp-bottom-bar">
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
              on="click"
              hideOnScroll={true}
              trigger={<div className="link-help"><i className="help circle icon"/></div>}
              flowing={true}
              hoverable={true}
            >
              {/*TODO*/}
            </Popup>
          </div>
          <div className="pp-mover-area"/>
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
