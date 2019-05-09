import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { createResource, updateResource } from 'common/store/tabs/tab/api/actions';

import classNames from 'classnames';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import _isEqual from 'lodash/isEqual';

import { AnnotationAPICreateModel, AnnotationAPIModel, AnnotationAPIModelAttrs } from 'common/api/annotations';
import { turnOffAnnotationMode } from 'common/chrome-storage';
import { PPScopeClass } from 'content-scripts/settings';
import { hideEditor } from 'common/store/tabs/tab/actions';
import { AppModes } from 'common/store/tabs/tab/appModes/types';
import { selectEditorState } from 'common/store/tabs/tab/selectors';

import { DraggableWidget } from 'content-scripts/components/widget';
import Button from '../elements/Button/Button';

import NoCommentModal from 'content-scripts/components/editor/NoCommentModal/NoCommentModal';
import PPCategoryButtonsBar from 'content-scripts/components/editor/PPCategoryButtonBar/PPCategoryButtonsBar';
import * as helpers from './helpers';

import styles from './Editor.scss';
import ppGa from 'common/pp-ga';
import { AnnotationPPCategories } from 'common/api/annotations';
import { AnnotationLocation } from '../../handlers/annotation-event-handlers';

import { Icon } from 'react-icons-kit/Icon';
import { link } from 'react-icons-kit/icomoon/link';
import { priceTag } from 'react-icons-kit/icomoon/priceTag';
import { ic_close } from 'react-icons-kit/md/ic_close';
import { ic_help_outline } from 'react-icons-kit/md/ic_help_outline';
import { ic_add_circle } from 'react-icons-kit/md/ic_add_circle';
import { changeNotification } from 'common/store/tabs/tab/widgets/actions';
import { bindActionCreators } from 'redux';
import { ToastType } from '../elements/Toast/Toast';
import { selectTab } from 'common/store/tabs/selectors';

interface IEditorProps {
  appModes: AppModes;

  locationX: number;
  locationY: number;

  annotation: AnnotationAPIModel;
  annotationLocation: AnnotationLocation;

  hideEditor: () => void;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
  createOrUpdateResource: (instance: AnnotationAPICreateModel) => Promise<object>;
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
      appModes: selectTab(state).appModes,
      locationX,
      locationY,

      annotationLocation,
      annotation,
    };
  },
  dispatch => ({
    ...bindActionCreators({
        hideEditor,
        changeNotification,
      },
      dispatch),
    createOrUpdateResource: (instance: AnnotationAPICreateModel) => {
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

  handleSubmit = (event: any) => {
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
    ppGa.annotationFormMoved();
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
      this.props.createOrUpdateResource(instance).then(() => {
        this.props.hideEditor();
        // Right after creating a new annotation, turn off the annotation mode (it might be already off)
        // Do it by directly changing Chrome storage. Changes to the Redux store will follow thanks to subscription.
        const { attributes } = instance;
        if (isNewInstance) {
          turnOffAnnotationMode(this.props.appModes, window.location.href);
          ppGa.annotationAdded(instance.id, attributes.ppCategory, !attributes.comment, attributes.annotationLink);
          this.props.changeNotification(true, 'Dodałeś/aś przypis', ToastType.success);
        } else {
          ppGa.annotationEdited(instance.id, attributes.ppCategory, !attributes.comment, attributes.annotationLink);
          this.props.changeNotification(true, 'Edytowałeś/aś przypis', ToastType.success);
        }
      }).catch((errors) => {
        console.log(errors);
        this.props.changeNotification(true, 'Błąd! Nie udało się zapisać przypisu', ToastType.failure);
      }).finally(() => {
        this.setState({ isCreating: false });
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
        <div className={classNames(styles.moverFrame)} ref={this.moverElement}>
          <label className={styles.editorHeader}>
            <Icon className={styles.icon} icon={ic_add_circle} size={20}/>
            Dodajesz przypis
          </label>

          <Popup
            className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<div className={styles.label}>Typ przypisu</div>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Typ sygnalizuje innym użytkownikom, na ile <br/>
            przypis jest zgodny z fragmentem artykułu, którego <br/>
            dotyczy.
          </Popup>
          <PPCategoryButtonsBar onSetPPCategory={this.handleSetPPCategory} ppCategory={ppCategory}/>
          <div
            className={styles.close}
            onClick={this.onCancelClick}
          >
            <Icon icon={ic_close} size={18}/>
          </div>

          <Popup
            className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<div className={styles.label}>Treść przypisu</div>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Treść powinna krótko informować o najważniejszych<br/>
            wnioskach z załączonego w przypisie źródła. <br/>
            Np. "Zgodnie z raportem ONZ ta informacja<br/>
            jest nieprawdziwa, ponieważ...". <br/>
            Możesz nie wpisywać treści, jeśli np. tylko <br/>
            podlinkowujesz źródło, w którym można doczytać <br/>
            więcej na dany temat.
          </Popup>
          <div className={classNames(styles.editorInput)}>
            <div className={classNames(styles.commentTextareaWrapper)}>
              <textarea
                autoFocus={true}
                name="comment"
                value={comment}
                onChange={this.handleInputChange}
              />
            </div>
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: commentError === '' })}
            >
              {commentError}
            </div>
          </div>
          <Popup
            className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<div className={styles.label}>Link do źródła</div>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Każdy przypis musi mieć swoje źródło. Pozwala ono <br/>
            innym czytelnikom zweryfikować informację, której <br/>
            dotyczy przypis i doczytać więcej na dany temat.
          </Popup>
          <div className={classNames(styles.editorInput, styles.annotationLink)}>
            <input
              type="text"
              name="annotationLink"
              className={annotationLinkError ? styles.error : ''}
              value={annotationLink}
              onChange={this.handleInputChange}
              placeholder="Wklej link do strony, na podstawie której dodajesz przypis"
            />
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: annotationLinkError === '' })}
            >
              {annotationLinkError}
            </div>
          </div>

          <Popup
            className={classNames(PPScopeClass, styles.tooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={
              <div className={styles.label}>
                Tytuł źródła
              </div>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Co znajduje się pod linkiem? Artykuł? <br/> Raport? O czym?
          </Popup>
          <div className={classNames(styles.editorInput, styles.annotationLinkTitle)}>
            <input
              type="text"
              name="annotationLinkTitle"
              className={annotationLinkTitleError ? styles.error : ''}
              value={annotationLinkTitle}
              onChange={this.handleInputChange}
              placeholder="np. Treść ustawy, Nagranie wypowiedzi, Artykuł na Wikipedii"
            />
            <div
              className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
                { [styles.hide]: annotationLinkTitleError === '' })}
            >
              {annotationLinkTitleError}
            </div>
          </div>

          <div className={styles.controls}>
            <Button className={styles.cancelButton} onClick={this.onCancelClick}>
              Anuluj
            </Button>
            <Button className={styles.saveButton} appearance="primary" onClick={this.handleSubmit}>
              Zapisz
            </Button>
            {noCommentModalOpen &&
            <NoCommentModal
              onCloseCommentModal={this.handleCloseCommentModal}
              onModalSaveClick={this.handleModalSaveClick}
            />}
          </div>
        </div>
      </DraggableWidget>
    );
  }

}

export default Editor;
