import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { createResource, updateResource } from 'redux-json-api';
import classNames from 'classnames';
import { Popup } from 'semantic-ui-react';
import _isEqual from 'lodash/isEqual';

import {
  AnnotationAPIModel,
  AnnotationAPICreateModel,
  AnnotationAPIModelAttrs,
} from 'content-scripts/api/annotations';
import { turnOffAnnotationMode } from 'common/chrome-storage';
import { PPScopeClass } from 'content-scripts/settings';
import { hideEditor } from 'content-scripts/store/actions';
import { AppModes } from 'content-scripts/store/appModes/types';
import { selectEditorState } from 'content-scripts/store/selectors';
import { IEditorRange } from 'content-scripts/store/widgets/reducers';

import { DraggableWidget } from 'content-scripts/components/widget';

import NoCommentModal from './NoCommentModal';
import PPCategoryButtonsBar from './PPCategoryButtonsBar';
import * as helpers from './helpers';

import styles from './Editor.scss';
import ppGA from 'common/pp-ga';
import { AnnotationPPCategories } from '../../api/annotations';
import { AnnotationLocation } from '../../handlers/annotation-event-handlers';

import { Icon } from 'react-icons-kit';
import { link } from 'react-icons-kit/icomoon/link'
import { priceTag } from 'react-icons-kit/icomoon/priceTag'
import { ic_close } from 'react-icons-kit/md/ic_close'
import {move} from 'react-icons-kit/iconic/move'

interface IEditorProps {
  appModes: AppModes;

  locationX: number;
  locationY: number;

  annotation: AnnotationAPIModel;
  annotationLocation: AnnotationLocation;

  createOrUpdateAnnotation: (instance: AnnotationAPICreateModel) => Promise<object>;
  hideEditor: () => void;
}

interface IEditorState {
  annotationId: string;
  ppCategory: AnnotationPPCategories;
  comment: string;
  annotationLink: string;
  annotationLinkTitle: string;
  annotationLocation: AnnotationLocation;

  locationX: number;
  locationY: number;
  moved: boolean;

  noCommentModalOpen: boolean;

  commentError: string;
  annotationLinkError: string;
  annotationLinkTitleError: string;

  isCreating: boolean;
}

@connect(
  (state) => {

    const {
      locationX,
      locationY,

      annotationLocation,
      annotation,
    } = selectEditorState(state);

    return {
      appModes: state.appModes,
      locationX,
      locationY,

      annotationLocation,
      annotation,
    };
  },
  dispatch => ({
    hideEditor: () => dispatch(hideEditor()),
    createOrUpdateAnnotation: (instance: AnnotationAPICreateModel) => {
      if (instance.id) {
        return dispatch(updateResource(instance));
      } else {
        return dispatch(createResource(instance));
      }
    },
  }),
)
class Editor extends React.Component<Partial<IEditorProps>,
  Partial<IEditorState>> {

  static defaultProps = {
    locationX: 0,
    locationY: 0,
  };

  static ppCategoryToClass = {
    [AnnotationPPCategories.ADDITIONAL_INFO]: styles.categoryAdditionalInfo,
    [AnnotationPPCategories.CLARIFICATION]: styles.categoryClarification,
    [AnnotationPPCategories.ERROR]: styles.categoryError,
  };

  static getDerivedStateFromProps(nextProps: IEditorProps, prevState: IEditorState) {
    /*
     * The window should update whenever either annotation or range changes
     * Comparing ranges is crucial when the annotation was null before and is null again;
     * However, it is not enough, as two annotations can be made for the exact same range
     */
    const nextAnnotation: any = nextProps.annotation || {};
    // Note: nextProps.annotation && nextProps.annotation.id === prevState.annotationId will generate updates
    // if only nextProps.annotation is null
    const areAnnotationsEqual = prevState.annotationId === nextAnnotation.id;
    const areRangesEqual = _isEqual(prevState.annotationLocation, nextProps.annotationLocation);
    if (areAnnotationsEqual && areRangesEqual) {
      return null;
    } else {
      const attrs: Partial<AnnotationAPIModelAttrs> = nextAnnotation.attributes || {};
      return {
        annotationId: nextAnnotation.id,
        annotationLocation: nextProps.annotationLocation,
        ppCategory: attrs.ppCategory || AnnotationPPCategories.ADDITIONAL_INFO,
        comment: attrs.comment || '',
        annotationLink: attrs.annotationLink || '',
        annotationLinkTitle: attrs.annotationLinkTitle || '',

        locationX: nextProps.locationX,
        locationY: nextProps.locationY,
        annotationLinkError: '',
        annotationLinkTitleError: '',
        commentError: '',
        noCommentModalOpen: false,
      };
    }
  }

  moverElement: RefObject<HTMLDivElement>;

  constructor(props: IEditorProps) {
    super(props);
    this.state = {};
    this.moverElement = React.createRef();
  }

  handleSetPPCategory = (ppCategory: AnnotationPPCategories) => {
    this.setState({
      ppCategory,
    });
  }

  handleCloseCommentModal = () => {
    this.setState({
      noCommentModalOpen: false,
    });
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = { [target.name]: target.value };

    // Whenever the field has changed, eradicate the error message
    if (stateUpdate.annotationLink) {
      stateUpdate.annotationLinkError = '';
    }
    if (stateUpdate.annotationLinkTitle) {
      stateUpdate.annotationLinkTitleError = '';
    }
    if (stateUpdate.comment) {
      stateUpdate.commentError = '';
    }
    this.setState(stateUpdate);
  }

  validateForm(): boolean {
    const {
      comment,
      annotationLink: link,
      annotationLinkTitle: linkTitle,
    } = this.state;

    const validationResult = helpers.validateEditorForm({ comment, link, linkTitle });

    if (validationResult.valid) {
      return true;
    }

    this.setState({
      ...validationResult.errors,
    });
    return false;
  }

  saveButtonClass(): string {
    return Editor.ppCategoryToClass[this.state.ppCategory];
  }

  onSaveClick = (event: any) => {
    if (this.validateForm()) { // if form values are correct
      if (!this.state.comment) { // if comment field is empty, display the modal
        this.setState({ noCommentModalOpen: true });
        return;
      }
      this.save();
    }
  }

  handleModalSaveClick = () => {
    this.save();
  }

  onCancelClick = (event: any) => {
    this.props.hideEditor();
  }

  onMoved = () => {
    ppGA.annotationFormMoved();
  }

  getAnnotationFromState() {
    const {
      range,
      quote,
      quoteContext,
    } = this.props.annotationLocation;

    return {
      id: this.props.annotation ? this.props.annotation.id : null,
      type: 'annotations',
      attributes: {
        url: window.location.href,
        range,
        quote,
        quoteContext,
        ppCategory: this.state.ppCategory,
        comment: this.state.comment,
        annotationLink: this.state.annotationLink,
        annotationLinkTitle: this.state.annotationLinkTitle,
      },
    };
  }

  save() {
    if (!this.state.isCreating) {
      this.setState({ isCreating: true });
      const instance = this.getAnnotationFromState();
      const isNewInstance = !instance.id;
      this.props.createOrUpdateAnnotation(instance).then(() => {
        this.setState({ isCreating: false });
        this.props.hideEditor();
        // Right after creating a new annotation, turn off the annotation mode (it might be already off)
        // Do it by directly changing Chrome storage. Changes to the Redux store will follow thanks to subscription.
        const attributes = instance.attributes;
        if (isNewInstance) {
          turnOffAnnotationMode(this.props.appModes);
          ppGA.annotationAdded(instance.id, attributes.ppCategory, !attributes.comment, attributes.annotationLink);
        } else {
          ppGA.annotationEdited(instance.id, attributes.ppCategory, !attributes.comment, attributes.annotationLink);
        }
      }).catch((errors) => {
        this.setState({ isCreating: false });
        console.log(errors);
        // TODO: show error toast here
      });
    }
  }

  render() {
    const {
      ppCategory,
      comment,
      commentError,
      annotationLink,
      annotationLinkError,
      annotationLinkTitle,
      annotationLinkTitleError,
      noCommentModalOpen,
    } = this.state;

    return (
      <DraggableWidget
        className={classNames(PPScopeClass, styles.self)}
        initialLocationX={this.props.locationX}
        initialLocationY={this.props.locationY}
        widgetTriangle={true}
        mover={this.moverElement}
        onMoved={this.onMoved}
      >
        <div className={classNames(styles.moverFrame, styles.moverArea)} ref={this.moverElement}>
          <label className={styles.editorHeader}> Co dodajesz? </label>
          <PPCategoryButtonsBar onSetPPCategory={this.handleSetPPCategory} ppCategory={ppCategory}/>
          <div
            className={styles.close}
            onClick={this.onCancelClick}
          >
            <Icon icon={ic_close} size={18} />
          </div>
          <div className={classNames(styles.editorInput)}>
            <div className={classNames(styles.commentTextareaWrapper)}>
              <textarea
                autoFocus={true}
                name="comment"
                value={comment}
                onChange={this.handleInputChange}
                placeholder="Dodaj treść przypisu"
              />
            </div>
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: commentError === '' })}
            >
              {commentError}
            </div>
          </div>
          <div className={classNames(styles.editorInput, styles.annotationLink)}>
            <input
              type="text"
              name="annotationLink"
              className={annotationLinkError ? styles.error : ''}
              value={annotationLink}
              onChange={this.handleInputChange}
              placeholder="Wklej link do źródła"
            />
            <Popup
              className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
              hideOnScroll={true}
              trigger={<Icon className={styles.inputIcon} icon={link} size={15} />}
              flowing={true}
              hoverable={true}
              position="top left"
            >
              Adres strony, z której pochodzą <br/> informacje zawarte w przypisie
            </Popup>
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: annotationLinkError === '' })}
            >
              {annotationLinkError}
            </div>
          </div>
          <div className={classNames(styles.editorInput, styles.annotationLinkTitle)}>
            <input
              type="text"
              name="annotationLinkTitle"
              className={annotationLinkTitleError ? styles.error : ''}
              value={annotationLinkTitle}
              onChange={this.handleInputChange}
              placeholder="Wpisz tytuł źródła"
            />
            <Popup
              className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
              hideOnScroll={true}
              trigger={<Icon className={styles.inputIcon} icon={priceTag} size={15} />}
              flowing={true}
              hoverable={true}
              position="top left"
            >
              np. <i>Treść ustawy</i>, <i>Artykuł na Wikipedii</i>,<br/> <i>Nagranie wypowiedzi ministra</i>
            </Popup>
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: annotationLinkTitleError === '' })}
            >
              {annotationLinkTitleError}
            </div>
          </div>
          <div className={styles.controls}>
            <button className={styles.cancel} onClick={this.onCancelClick}>
              {' '}Anuluj{' '}
            </button>
            <button className={classNames(styles.save, this.saveButtonClass())} onClick={this.onSaveClick}>
              {' '}Zapisz{' '}
            </button>
            <NoCommentModal
              open={noCommentModalOpen}
              onCloseCommentModal={this.handleCloseCommentModal}
              onModalSaveClick={this.handleModalSaveClick}
            />
          </div>
        </div>
      </DraggableWidget>
    );
  }

}

export default Editor;
