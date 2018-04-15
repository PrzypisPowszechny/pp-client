import React, {RefObject} from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Widget from '../widget/Widget';
import styles from './Editor.scss';
import AnnotationViewModel from '../../models/AnnotationViewModel';
import {AnnotationPriorities, annotationPrioritiesLabels} from "../consts";
import {Modal, Popup} from "semantic-ui-react";
import PriorityButton from "./priority-button/PriorityButton";
import {DragTracker, IVec2, mover} from "utils/move";

interface IEditorProps {
  visible: boolean;
  invertedX: boolean;
  invertedY: boolean;
  locationX: number;
  locationY: number;

  form: IEditorForm;
  editor: any;
}

export interface IEditorForm {
  priority: AnnotationPriorities;
  comment: string;
  referenceLink: string;
  referenceLinkTitle: string;
}

export interface IEditorState extends IEditorForm {
  locationX: number;
  locationY: number;
  referenceLinkError: string;
  referenceLinkTitleError: string;
  noCommentModalOpen: boolean;
}

function annotationForm(annotation?: AnnotationViewModel): IEditorForm {
  const model: any = annotation || {};
  return {
    priority: model.priority || AnnotationPriorities.NORMAL,
    comment: model.comment || '',
    referenceLink: model.referenceLink || '',
    referenceLinkTitle: model.referenceLinkTitle || '',
  };
}

@connect((state) => {
  let form;
  if (state.annotationId) {
    form = annotationForm();
  } else {
    form = annotationForm(state.annotations.find(x => x.id === state.editor.annotationId));
  }
  return {
    editor: state.editor,
    form,
  };
})
class Editor extends React.Component<
  Partial<IEditorProps>,
  Partial<IEditorState>
  > {

  static defaultProps = {
    visible: true,
    invertedX: false,
    invertedY: false,
    locationX: 0,
    locationY: 0,
  };

  static priorityToClass = {
    [AnnotationPriorities.NORMAL]: styles.priorityNormal,
    [AnnotationPriorities.WARNING]: styles.priorityWarning,
    [AnnotationPriorities.ALERT]: styles.priorityAlert,
  };

  static stateFromProps(props: IEditorProps): IEditorState {
    return {
      ...props.form,
      locationX: props.editor.location.x,
      locationY: props.editor.location.y,
      referenceLinkError: '',
      referenceLinkTitleError: '',
      noCommentModalOpen: false,
    };
  }

  rootElement: RefObject<Widget>;
  moverElement: RefObject<HTMLDivElement>;
  dragTracker: DragTracker;

  constructor(props: IEditorProps) {
    super(props);
    this.state = Editor.stateFromProps(props);
    this.rootElement = React.createRef();
    this.moverElement = React.createRef();
  }

  componentWillReceiveProps(newProps: IEditorProps) {
    this.setState(Editor.stateFromProps(newProps));
  }

  componentWillUpdate(nextProps: IEditorProps, nextState: Partial<IEditorState>) {
    // Whenever the field has changed, eradicate the error message
    if (nextState.referenceLink) {
      nextState.referenceLinkError = '';
    }
    if (nextState.referenceLinkTitle) {
      nextState.referenceLinkTitleError = '';
    }
  }

  onMove = (delta: IVec2) => {
    // console.log(this.props.onEditorDrag);
    this.setState({
      locationX: this.state.locationX + delta.x,
      locationY: this.state.locationY + delta.y,
    });
    return true;
  }

  setupMover() {
    const rootElement = this.rootElement.current.rootElement.current;
    const moverElement = this.moverElement.current;
    if (rootElement && moverElement) {
      if (this.dragTracker) {
        this.dragTracker.destroy();
      }
      this.dragTracker = new DragTracker(moverElement, this.onMove);
    }
  }

  componentDidMount() {
    // invoked on the first render only
    this.setupMover();
  }

  componentDidUpdate() {
    // invoked on all but the first render
    this.setupMover();
  }

  isNewAnnotation() {
    return this.props.editor.annotationId !== null;
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
    const name = target.name;
    this.setState({ [name]: target.value });
  }

   validateForm(): boolean {
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
    return Editor.priorityToClass[this.state.priority];
  }

  onSave = (event: any) => {
    // copied from old_src; TODO review
    if (this.validateForm()) { // if form values are correct
      if (!this.state.comment) { // if comment field is empty, display the modal
        this.setState({ noCommentModalOpen: true });
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
     console.log(this.props.annotation);
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
      invertedX,
      invertedY,
    } = this.props.editor;

    return (
      <Widget
        className={classNames("pp-ui", styles.self)}
        visible={visible}
        invertedX={invertedX}
        invertedY={invertedY}
        locationX={locationX}
        locationY={locationY}
        ref={this.rootElement}
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
          <i className="remove icon"/>
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
          <i className={classNames(styles.inputIcon, 'linkify', 'icon')}/>
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: referenceLinkError === ''})}
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
          <i className={classNames(styles.inputIcon, 'tags', 'icon')}/>
          <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: referenceLinkTitleError === ''})}
              >
            {referenceLinkTitleError}
          </div>
          <Popup
              className="pp-ui small-padding"
              hideOnScroll={true}
              trigger={<div className={styles.linkHelp}><i className="help circle icon"/></div>}
              flowing={true}
              hoverable={true}
          >
            np. <i>Treść ustawy</i>, <i>Wikipedia</i>,<br/> <i>Nagranie wypowiedzi ministra</i>
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
          <img className={styles.moverIcon}/>
        </div>
      </Widget>
    );
  }

}

export default Editor;
