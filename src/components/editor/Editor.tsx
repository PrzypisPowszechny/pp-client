import React from 'react';
import classNames from 'classnames';
import Widget from '../Widget';
import styles from './Editor.scss';
import AnnotationViewModel from './AnnotationViewModel';
import {AnnotationPriorities, annotationPrioritiesLabels} from "../consts";
import {Modal, Popup} from "semantic-ui-react";
import PriorityButton from "./priority-button/PriorityButton";


interface IEditorProps {
  visible?: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;
  annotation: AnnotationViewModel;
}

export interface IEditorState {
  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;

  referenceLinkError: string;
  referenceLinkTitleError: string;
  noCommentModalOpen: boolean;
}

const priorityToClass = {
  [AnnotationPriorities.NORMAL]: 'priority-normal',
  [AnnotationPriorities.WARNING]: 'priority-warning',
  [AnnotationPriorities.ALERT]: 'priority-alert',
};

class Editor extends React.Component<
  IEditorProps,
  Partial<IEditorProps>
  > {

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
    annotation: null
  };

  isNewAnnotation() {
    return this.props.annotation.id == 0
  }

  static stateFromProps(props: IEditorProps): IEditorState {
    // TODO perhaps replace AnnotationViewModel with AnnotationModel
    const annotation = props.annotation || new AnnotationViewModel();
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

  commentInput: HTMLTextAreaElement;

  constructor(props: IEditorProps) {
    super(props);
    this.state = Editor.stateFromProps(props);
  }

  componentWillReceiveProps(newProps: IEditorProps) {
    this.setState(Editor.stateFromProps(newProps));
  }

  // TODO KG debug; it probably doesn't always work
  componentDidMount() {
    // Set focus after a tiny timeout; needed at least for Chrome
    setTimeout(() => this.commentInput.focus(), 20);
  }

  setPriority = (priority: AnnotationPriorities) => {
    this.setState({
      priority,
    });
  };

  setModalOpen = () => {
    this.setState({
      noCommentModalOpen: false,
    });
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const name = target.name;
    this.setState({ [name]: target.value });
  };

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

  saveButtonClass(): string {
    return priorityToClass[this.state.priority];
  }

  private onSave(event: any) {
    this.executeSave();
     // TODO
  }

  private onCancel(event: any) {
    // TODO
  }

  executeSave = () => {
     //TODO
  };

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
      <Widget
        className={classNames("pp-ui", styles.self)}
        visible={this.props.visible}
        invertedX={this.props.invertedX}
        invertedY={this.props.invertedY}
        locationX={this.props.locationX}
        locationY={this.props.locationY}
      >
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
            className={classNames('pp-error-msg', 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { 'pp-hide': referenceLinkError})}
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
              className={classNames('pp-error-msg', 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { 'pp-hide': referenceLinkTitleError})}
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
          <img className="mover-icon"/>
        </div>
      </Widget>
    );
  }

}

export default Editor;
