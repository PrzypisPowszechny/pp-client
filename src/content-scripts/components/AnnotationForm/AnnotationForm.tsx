import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import ppGa from 'common/pp-ga';

import styles from './AnnotationForm.scss';
import { Icon } from 'react-icons-kit/Icon';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import { changeNotification, hideAnnotationForm } from 'common/store/tabs/tab/widgets/actions';
import * as helpers from './helpers';
import Button from '../elements/Button/Button';
import { ToastType } from '../elements/Toast/Toast';
import { selectTab } from 'common/store/tabs/selectors';
import { ITabInfoState } from 'common/store/tabs/tab/tabInfo';
import { AnnotationRequestAPIModel } from 'common/api/annotation-requests';
import { selectAnnotationRequest } from 'common/store/tabs/tab/api/selectors';
import {
  AnnotationAPICreateModel,
  AnnotationAPIModel,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import { createResource } from 'common/store/tabs/tab/api/actions';

export interface AnnotationFormData {
  comment: string;
}

export interface AnnotationFormProps {
  tabInfo: ITabInfoState;
  annotationRequest: AnnotationRequestAPIModel;

  hideAnnotationForm: () => void;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
  createAnnotation: (instance: AnnotationAPICreateModel) => Promise<{ data: AnnotationAPIModel }>;
}

interface AnnotationFormState extends AnnotationFormData {
  ppCategory: AnnotationPPCategories;
  annotationLink: string;
  annotationLinkTitle: string;

  noCommentModalOpen: boolean;

  commentError: string;
  annotationLinkError: string;
  annotationLinkTitleError: string;

  isCreating: boolean;
}

@connect(
  state => ({
    tabInfo: selectTab(state).tabInfo,
    annotationRequest: selectAnnotationRequest(state, selectTab(state).widgets.annotationForm.annotationRequestId),
  }),
  {
    hideAnnotationForm,
    changeNotification,
    createAnnotation: createResource,
  },
)
export default class AnnotationForm extends React.Component<Partial<AnnotationFormProps>,
  Partial<AnnotationFormState>> {

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ppCategory: AnnotationPPCategories.ADDITIONAL_INFO,
      comment: '',
      annotationLink: '',
      annotationLinkTitle: '',

      commentError: '',
      annotationLinkError: '',
      annotationLinkTitleError: '',
      noCommentModalOpen: false,
    };
  }

  constructor(props: AnnotationFormProps) {
    super(props);
    this.state = {};
  }

  getAnnotationFromState(): AnnotationAPICreateModel {
    const { url, range, quote, quoteContext } = this.props.annotationRequest.attributes;

    return {
      type: 'annotations',
      attributes: {
        // Some fields are exact copy from annotationRequest
        url, range, quote, quoteContext,
        ppCategory: this.state.ppCategory,
        comment: this.state.comment,
        annotationLink: this.state.annotationLink,
        annotationLinkTitle: this.state.annotationLinkTitle,
      },
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.currentTarget;
    const stateUpdate = { [target.name]: target.value };

    // Whenever the field has changed, eradicate the error message
    if (stateUpdate.quote) {
      stateUpdate.quoteError = '';
    }
    if (stateUpdate.annotationLink) {
      stateUpdate.annotationLinkError = '';
    }
    if (stateUpdate.annotationLinkTitle) {
      stateUpdate.annotationLinkTitleError = '';
    }
    this.setState(stateUpdate);
  }

  validateForm(): boolean {
    const { comment, annotationLink, annotationLinkTitle } = this.state;

    const validationResult = helpers.validateAnnotationForm({ comment, annotationLink, annotationLinkTitle });

    if (validationResult.valid) {
      return true;
    }
    this.setState({
      ...validationResult.errors,
    });
    return false;
  }

  handleCancelClick = (e: any) => {
    this.props.hideAnnotationForm();
    ppGa.annotationAddingModeCancelled();
  }

  handleSubmit = (e) => {
    if (this.validateForm()) {
      this.props.createAnnotation(this.getAnnotationFromState()).then((jsonData) => {
        this.props.hideAnnotationForm();
        this.props.changeNotification(true, 'Twoja odpowiedź na prośbę o przypis została dodana', ToastType.success);
        const instance = jsonData.data;
        const { comment, ppCategory, annotationLink } = instance.attributes;
        ppGa.annotationAdded(instance.id, ppCategory, !comment, annotationLink);
      }).catch((error) => {
        this.props.changeNotification(true, 'Błąd! Nie udało się zapisać', ToastType.failure);
        throw new Error(`Failed to submit annotation form: ${error}`);
      });
    }
  }

  render() {
    const {
      comment, commentError,
      ppCategory,
      annotationLink, annotationLinkError,
      annotationLinkTitle, annotationLinkTitleError,
    } = this.state;
    const { quote, comment: annotationRequestComment } = this.props.annotationRequest.attributes;

    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div>
          <div className={styles.header}>
            <Icon className={styles.headerIcon} icon={ic_live_help} size={27}/>
            Odpowiedz na prośbę o przypis
          </div>
          <p className={styles.description}/>
        </div>
        <div className={styles.label}>Cytat, do którego odnosi się prośba</div>
        <div className={styles.quote}>
          {quote}
        </div>
        {annotationRequestComment &&
        <div>
          <div className={styles.label}>Komentarz zgłaszającego</div>
          <div className={styles.quote}>
            {annotationRequestComment}
          </div>
        </div>
        }

        <div className={styles.label}>
          <Popup
            className={classNames(PPScopeClass, styles.popupTooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<span className={styles.popupLabel}>Typ przypisu</span>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Typ sygnalizuje innym użytkownikom, na ile <br/>
            przypis jest zgodny z fragmentem artykułu, którego <br/>
            dotyczy.
          </Popup>
        </div>
        <div className={classNames(styles.formFieldWrapper)}>
          <select
            className={styles.formField}
            name="ppCategory"
            value={ppCategory}
            onChange={this.handleInputChange}
          >
            <option
              label={annotationPPCategoriesLabels.ADDITIONAL_INFO}
              value={AnnotationPPCategories.ADDITIONAL_INFO}
            />
            <option
              label={annotationPPCategoriesLabels.CLARIFICATION}
              value={AnnotationPPCategories.CLARIFICATION}
            />
            <option
              label={annotationPPCategoriesLabels.ERROR}
              value={AnnotationPPCategories.ERROR}
            />
          </select>
        </div>

        <div className={styles.label}>
          <Popup
            className={classNames(PPScopeClass, styles.popupTooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<span className={styles.popupLabel}>Treść przypisu (nieobowiązkowa)</span>}
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
        </div>

        <div className={classNames(styles.formFieldWrapper)}>
          <div className={classNames(styles.commentTextareaWrapper)}>
            <textarea
              className={styles.formField}
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

        <div className={styles.label}>
          <Popup
            className={classNames(PPScopeClass, styles.popupTooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<span className={styles.popupLabel}>Link do źródła</span>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Każdy przypis musi mieć swoje źródło. Pozwala ono <br/>
            innym czytelnikom zweryfikować informację, której <br/>
            dotyczy przypis i doczytać więcej na dany temat.
          </Popup>
        </div>

        <div className={classNames(styles.formFieldWrapper, styles.annotationLink)}>
          <input
            type="text"
            name="annotationLink"
            className={classNames(styles.formField, annotationLinkError ? styles.error : '')}
            value={annotationLink}
            onChange={this.handleInputChange}
            placeholder="Wklej link do strony, na podstawie której dodajesz przypis"
          />
          <Label
            className={classNames(styles.errorMsg, { [styles.hide]: annotationLinkError === '' })}
            basic pointing color='red' size='large'
          >
            {annotationLinkError}
          </Label>


        </div>


        <div className={styles.label}>
          <Popup
            className={classNames(PPScopeClass, styles.popupTooltip, 'small-padding')}
            hideOnScroll={true}
            trigger={<span className={styles.popupLabel}>Tytuł źródła</span>}
            flowing={true}
            hoverable={true}
            position="left center"
          >
            Co znajduje się pod linkiem? Artykuł? <br/> Raport? O czym?
          </Popup>
        </div>
        <div className={classNames(styles.formFieldWrapper, styles.annotationLinkTitle)}>
          <input
            type="text"
            name="annotationLinkTitle"
            className={classNames(styles.formField, annotationLinkError ? styles.error : '')}
            value={annotationLinkTitle}
            onChange={this.handleInputChange}
            placeholder="np. Treść ustawy, Nagranie wypowiedzi, Artykuł na Wikipedii"
          />
                    <Label
            className={classNames(styles.errorMsg, { [styles.hide]: annotationLinkTitleError === '' })}
            basic pointing color='red' size='large'
          >
            {annotationLinkTitleError}
          </Label>
        </div>

        <div className={styles.actions}>
          <Button appearance="subtle" onClick={this.handleCancelClick}>
            Anuluj
          </Button>
          <Button className={styles.submitButton} appearance="primary" onClick={this.handleSubmit}>
            Wyślij
          </Button>
        </div>
      </div>
    )
      ;
  }
}
