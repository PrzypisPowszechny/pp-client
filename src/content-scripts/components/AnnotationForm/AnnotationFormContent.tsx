import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';

import classNames from 'classnames';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';

import { AnnotationRequestAPIModel } from 'common/api/annotation-requests';
import {
  AnnotationAPIModel,
  AnnotationAPIModelUpdatableAttrs,
  AnnotationPPCategories,
  annotationPPCategoriesLabels,
} from 'common/api/annotations';
import { ITabInfoState } from 'common/store/tabs/tab/tabInfo';
import { PPScopeClass } from 'content-scripts/settings';

import styles from './AnnotationForm.scss';
import * as helpers from './helpers';

import Button from '../elements/Button/Button';

export interface AnnotationFormContentProps {
  tabInfo: ITabInfoState;

  annotationRequest: AnnotationRequestAPIModel;
  annotation: AnnotationAPIModel | null;
  initialData?: AnnotationAPIModelUpdatableAttrs;

  handleSubmit: (formData: AnnotationAPIModelUpdatableAttrs) => void;
  handleCancel: () => void;
}

interface AnnotationFormContentState extends AnnotationAPIModelUpdatableAttrs {
  noCommentModalOpen: boolean;

  commentError: string;
  annotationLinkError: string;
  annotationLinkTitleError: string;

  isCreating: boolean;
}

export default class AnnotationFormContent extends React.Component<Partial<AnnotationFormContentProps>,
  Partial<AnnotationFormContentState>> {

  constructor(props: AnnotationFormContentProps) {
    super(props);

    const initialData = this.props.initialData || {};

    this.state = {
      ppCategory: AnnotationPPCategories.ADDITIONAL_INFO,
      comment: '',
      annotationLink: '',
      annotationLinkTitle: '',
      ...initialData,

      commentError: '',
      annotationLinkError: '',
      annotationLinkTitleError: '',
      noCommentModalOpen: false,
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
    this.props.handleCancel();
  }

  handleSubmit = (e) => {
    if (this.validateForm()) {
      this.props.handleSubmit(this.state as AnnotationAPIModelUpdatableAttrs);
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
            basic={true}
            pointing={true}
            color="red"
            size="large"
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
            basic={true}
            pointing={true}
            color="red"
            size="large"
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
