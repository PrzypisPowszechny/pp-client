import React from 'react';
import { AnnotationPriorities } from '../consts';
import {IAnnotationFields, AnnotationViewModel} from '../annotation';
import '../../css/editor.scss';
import { Header, Popup, Grid, Modal} from 'semantic-ui-react'

const savedFields = ['priority', 'comment', 'referenceLink', 'referenceLinkTitle'];
// Add Semantic-ui packages
import 'semantic-ui/dist/semantic.css';
import 'semantic-ui/dist/semantic.js';

export interface IAnnotationFormProps {
  id: number;
  annotation: AnnotationViewModel;
  saveAction(annotation: AnnotationViewModel): any;
  onSave(e: any): any;
  onCancel(e: any): any;
}

export interface IAnnotationFormState extends IAnnotationFields {
  referenceLinkError: string;
  noCommentModalOpen: boolean;
}

function sliceKeys(dictionary: any, keys: string[]) {
  const result: {
    [x: string]: any;
  } = {};
  keys.forEach(key => {
    result[key] = dictionary[key];
  });
  return result;
}

function getFormState(obj: any) {
  return sliceKeys(obj, savedFields) as IAnnotationFormState;
}

export default class AnnotationForm extends React.Component<
  IAnnotationFormProps,
  Partial<IAnnotationFormState>
> {

  private noCommentModal: Modal;

  private static stateFromProps(props: IAnnotationFormProps): IAnnotationFormState {
    const annotation = props.annotation;
    return {
      priority: annotation.priority || AnnotationPriorities.NORMAL,
      comment: annotation.comment || '',
      referenceLink: annotation.referenceLink || '',
      referenceLinkError: '',
      referenceLinkTitle: annotation.referenceLinkTitle || '',
      noCommentModalOpen: false
    };
  }

  constructor(props: IAnnotationFormProps) {
    super(props);
    this.state = AnnotationForm.stateFromProps(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.executeSave = this.executeSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  public componentWillUpdate(_nextProps: IAnnotationFormProps, nextState: Partial<IAnnotationFormState>) {
    // Whenever link is changed, eradicate the error message
    if(nextState.referenceLink) {
      nextState.referenceLinkError = '';
    }
  }

  public saveButtonClass() {
    const priorityToClass = {
      [AnnotationPriorities.NORMAL]: 'priority-normal',
      [AnnotationPriorities.WARNING]: 'priority-warning',
      [AnnotationPriorities.ALERT]: 'priority-alert',
    };
    return priorityToClass[this.state.priority || AnnotationPriorities.NORMAL];
  }

  // A modal displayed when user tries to save the form with comment field empty
  public renderNoCommentModal() {
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
                  onClick={() => this.setState({noCommentModalOpen: false})}
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

  public render() {
      const {
          priority,
          comment,
          referenceLink,
          referenceLinkTitle,
      } = this.state;

    return (
        <div className="pp-widget">
          <div className="pp-editor-head-bar">
            <label className="priority-header"> Co dodajesz? </label>
            <Popup
                on="click"
                hideOnScroll
                trigger={<div className="priority-help"> <i className="help circle icon"></i> </div>}
                flowing
                hoverable
            >
              {/*TODO just an instruction stub*/}
              <Grid centered divided columns={3}>
                <Grid.Column textAlign='center'>
                  <Header as='h4'>Niebieski przypis</Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h4'>Żółty przypis</Header>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Header as='h4'>Pomarańczowy przypis</Header>
                </Grid.Column>
              </Grid>
            </Popup>
            <br/>
            {/*KG todo could probably be neater if done with sth like PriorityButton component*/}
            <div className="priority-normal">
              <button
                  className={"pp-editor-priority" + (priority == AnnotationPriorities.NORMAL ? ' selected' : '')}
                  onClick={() => this.setState({priority: AnnotationPriorities.NORMAL})}
              >
                dodatkowa informacja
              </button>
            </div>
            <div className="priority-warning">
              <button
                  className={"pp-editor-priority" + (priority == AnnotationPriorities.WARNING ? ' selected' : '')}
                  onClick={() => this.setState({priority: AnnotationPriorities.WARNING})}
              >
                wyjaśnienie
              </button>
            </div>
            <div className="priority-alert">
              <button
                  className={"pp-editor-priority" + (priority == AnnotationPriorities.ALERT ? ' selected' : '')}
                  onClick={() => this.setState({priority: AnnotationPriorities.ALERT})}
              >
                sprostowanie błędu
              </button>
            </div>

          </div>
          <div
              className="pp-close"
              onClick={(e) => this.onCancel(e)}
          >
            <i className="remove icon"></i>
          </div>
          <div className="editor-input pp-comment">
          <textarea
              name="comment"
              value={comment}
              onChange={this.handleInputChange}
              placeholder="Dodaj treść przypisu"
          />
          </div>
          <div className={"editor-input pp-reference-link" + (this.state.referenceLinkError ? ' ui input error' : '')}>
            <input
                type="text"
                name="referenceLink"
                value={referenceLink}
                onChange={this.handleInputChange}
                placeholder="Wklej link do źródła"
            />
            <i className="input-icon linkify icon"></i>
            <div
                className={"pp-error-msg ui pointing red basic label large" + (this.state.referenceLinkError ? '' : ' pp-hide')}>
              {this.state.referenceLinkError}
            </div>
          </div>
          <div className="pp-bottom-bar">
            <div className={"editor-input pp-reference-link-title"}>
              <input
                  type="text"
                  name="referenceLinkTitle"
                  value={referenceLinkTitle}
                  onChange={this.handleInputChange}
                  placeholder="Wpisz tytuł źródła"
              />
              <i className="input-icon tags icon"></i>
              <Popup
                  on="click"
                  hideOnScroll
                  trigger={<div className="link-help"> <i className="help circle icon"></i> </div>}
                  flowing
                  hoverable
              >
                {/*TODO*/}
              </Popup>
            </div>
            <div className="pp-mover-area"></div>
            <div className="pp-controls">
              <button className="pp-cancel" onClick={(e) => this.onCancel(e)}>
                {' '}Anuluj{' '}
              </button>
              <button className={"pp-save annotator-focus " + this.saveButtonClass()} onClick={(e) => this.onSave(e)}>
                {' '}Zapisz{' '}
              </button>
              {this.renderNoCommentModal()}
            </div>
          </div>
        </div>
    );
  }

  public componentWillReceiveProps(newProps: IAnnotationFormProps) {
    this.setState(AnnotationForm.stateFromProps(newProps));
  }

  private handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.currentTarget;
    const name = target.name;
    this.setState({ [name]: target.value });
  }

  private validateForm(): boolean {
    if (!this.state.referenceLink) {
      this.setState({referenceLinkError: 'Musisz podać źródło, jeśli chcesz dodać przypis!'});
      return false;
    }
    return true;
  }

  private onSave(event: any) {
    // Copy form fields onto (much larger) view model before executing saveAction
    Object.assign(this.props.annotation, getFormState(this.state));
    if (this.validateForm()) { // if form values are correct
      if (!this.state.comment) { // if comment field is empty, display the modal
        this.setState({noCommentModalOpen: true});
        return;
      }
      this.executeSave(event);
    }
  }

  private executeSave(event: any) {
    const result = this.props.saveAction(this.props.annotation);
      Promise.resolve(result)     // it will work whether result is a Promise or a value
          .then((result) => {
            const errors = result.errors;
            if (errors) {
              //TODO handle form validation messages here

            } else {
              this.props.onSave(event);
            }
          });
    this.setState({noCommentModalOpen: false});
  }

  private onCancel(event: any) {
    this.props.onCancel(event);
  }
}
