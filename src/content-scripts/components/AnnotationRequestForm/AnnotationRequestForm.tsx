import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import ppGa from 'common/pp-ga';

import styles from './AnnotationRequestForm.scss';
import { Icon } from 'react-icons-kit/Icon';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { changeNotification, hideAnnotationRequestForm } from 'common/store/tabs/tab/widgets/actions';
import * as helpers from './helpers';
import Button from '../elements/Button/Button';
import { ToastType } from '../elements/Toast/Toast';
import { selectTab } from 'common/store/tabs/selectors';
import { ITabInfoState } from '../../../common/store/tabs/tab/tabInfo';
import { createResource } from '../../../common/store/tabs/tab/api/actions';
import { AnnotationRequestAPICreateModel } from '../../../common/api/annotation-requests';

export interface AnnotationRequestFormData {
  quote: string;
  comment: string;
}

export interface AnnotationRequestFormProps {
  initialData: Partial<AnnotationRequestFormData>;
  tabInfo: ITabInfoState;

  hideAnnotationRequestForm: () => void;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
  createResource: (instance: AnnotationRequestAPICreateModel) => Promise<object>;
}

interface AnnotationRequestFormState extends AnnotationRequestFormData {
  quote: string;
  comment: string;

  quoteError: string;
  commentError: string;

  isCreating: boolean;
}

@connect(
  state => ({
    initialData: selectTab(state).widgets.annotationRequestForm.initialData,
    tabInfo: selectTab(state).tabInfo,
  }),
  {
    hideAnnotationRequestForm,
    changeNotification,
    createResource,
  },
)
export default class AnnotationRequestForm extends React.Component<Partial<AnnotationRequestFormProps>,
  Partial<AnnotationRequestFormState>> {

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      quote: '',
      comment: '',
      ...nextProps.initialData,
      quoteError: '',
      commentError: '',
    };
  }

  constructor(props: AnnotationRequestFormProps) {
    super(props);
    this.state = {};
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const stateUpdate = { [target.name]: target.value };

    // Whenever the field has changed, eradicate the error message
    if (stateUpdate.quote) {
      stateUpdate.quoteError = '';
    }
    if (stateUpdate.comment) {
      stateUpdate.commentError = '';
    }
    this.setState(stateUpdate);
  }

  validateForm(): boolean {
    const { quote, comment } = this.state;

    const validationResult = helpers.validateAnnotationRequestForm({ quote, comment });

    if (validationResult.valid) {
      return true;
    }
    this.setState({
      ...validationResult.errors,
    });
    return false;
  }

  handleCancelClick = (e: any) => {
    this.props.hideAnnotationRequestForm();
    ppGa.annotationAddingModeCancelled();
  }

  handleSubmit = (e) => {
    if (this.validateForm()) {
      this.save();
    }
  }

  getAnnotationRequestFromState() {
    const { quote, comment } = this.state;
    const url = this.props.tabInfo.currentUrl;
    return {
      type: 'annotationRequests',
      attributes: {
        url,
        quote,
        comment,
      },
    };
  }

  save() {
    if (!this.state.isCreating) {
      this.setState({ isCreating: true });
      const instance = this.getAnnotationRequestFromState();
      this.props.createResource(instance).then((response) => {
        this.props.hideAnnotationRequestForm();
        this.props.changeNotification(true, 'Twoja prośba o przypis została wysłana', ToastType.success);
        const { attributes } = instance;
        ppGa.annotationRequestSent(!attributes.quote, !attributes.comment);
      }).catch((error) => {
        this.props.changeNotification(true, 'Błąd! Nie udało się wysłać prośby', ToastType.failure);
        throw new Error(`Failed to submit annotation request form: ${error}`);
      }).finally(() => {
        this.setState({ isCreating: false });
      });
    }
  }

  render() {
    const { quote, comment, quoteError, commentError } = this.state;

    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div>
          <div className={styles.header}>
            <Icon className={styles.headerIcon} icon={ic_live_help} size={27}/>
            Poproś o przypis
          </div>
          <p className={styles.description}>Masz wątpliwości, czy to, co czytasz, ma sens? <br/>
            Zgłoś do sprawdzenia fragment z tej strony,
            a dodamy jego miejscu przypis z oceną wiarygodności i źródłem.
          </p>
        </div>
        <div className={styles.label}>Fragment do sprawdzenia</div>
        <div className={styles.quote}>
          <textarea
            className={styles.formField}
            autoFocus={true}
            name="quote"
            placeholder="Przeklej fragment artykułu"
            value={quote}
            onChange={this.handleInputChange}
          />
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: quoteError === '' })}
          >
            {quoteError}
          </div>
        </div>
        <div className={styles.label}>Komentarz (opcjonalny)</div>
        <div className={styles.comment}>

          <textarea
            className={styles.formField}
            name="comment"
            placeholder="Napisz, na co zwrócić szczególną uwagę"
            value={comment}
            onChange={this.handleInputChange}
          />
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: commentError === '' })}
          >
            {commentError}
          </div>
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
    );
  }
}
