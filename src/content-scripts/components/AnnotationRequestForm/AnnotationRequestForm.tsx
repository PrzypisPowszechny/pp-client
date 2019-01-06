import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import { turnOffRequestMode } from 'common/chrome-storage';
import { AnnotationRequestFormData, AppModes } from 'content-scripts/store/appModes/types';
import { saveAnnotationRequest } from 'common/api/utils';
import ppGA from 'common/pp-ga';

import styles from './AnnotationRequestForm.scss';
import { Icon } from 'react-icons-kit';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { changeNotification } from '../../store/widgets/actions';
import * as helpers from './helpers';
import Button from '../elements/Button/Button';
import { ToastType } from '../elements/Toast/Toast';

export interface AnnotationRequestFormProps {
  appModes: AppModes;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
}

interface AnnotationRequestFormState extends AnnotationRequestFormData {
  commentError: string;
  quoteError: string;
  notificationEmailError: string;
}

@connect(
  state => ({
    appModes: state.appModes,
  }),
  { changeNotification },
)
export default class AnnotationRequestForm extends React.Component<Partial<AnnotationRequestFormProps>,
  Partial<AnnotationRequestFormState>> {

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      quote: '',
      comment: '',
      notificationEmail: '',
      ...nextProps.appModes.requestModeFormData,
      commentError: '',
      quoteError: '',
      notificationEmailError: '',
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
    if (stateUpdate.notificationEmail) {
      stateUpdate.notificationEmailError = '';
    }
    this.setState(stateUpdate);
  }

  validateForm(): boolean {
    const { quote, comment, notificationEmail, quoteError, notificationEmailError } = this.state;

    const validationResult = helpers.validateAnnotationRequestForm({ quote, comment, notificationEmail });
    console.log(validationResult)

    if (validationResult.valid) {
      return true;
    }
    this.setState({
      ...validationResult.errors,
    });
    return false;
  }

  handleCancelClick = (e: any) => {
    turnOffRequestMode(this.props.appModes, window.location.href);
    ppGA.annotationAddingModeCancelled();
  }

  handleSubmit = (e) => {
    if (this.validateForm()) {
      const { quote, comment, notificationEmail } = this.state;
      const url = window.location.href;
      saveAnnotationRequest({
        url, quote, comment, notificationEmail,
      }).then((response) => {
        this.props.changeNotification(true, 'Twoja prośba o przypis została wysłana');
        turnOffRequestMode(this.props.appModes, window.location.href);
      }).catch((error) => {
        console.log(error);
        this.props.changeNotification(true, 'Błąd! Nie udało się wysłać prośby', ToastType.failure);
      });
    }
  }

  render() {
    const { quote, comment, notificationEmail, quoteError, commentError, notificationEmailError } = this.state;

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
            a dodamy jego miejscu przypis z naszą oceną wiarygodności i źródłem.
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

        <div className={styles.label}>Twój adres e-mail (opcjonalny)</div>
        <p className={styles.caption}>
          Zostaw adres e-mail, jeśli chcesz żebyśmy powiadomili Cię, kiedy dodamy w tym miejscu przypis
        </p>
        <div className={styles.notificationEmail}>
          <input
            className={styles.formField}
            name="notificationEmail"
            value={notificationEmail}
            onChange={this.handleInputChange}
          />
          <div
            className={classNames(styles.errorMsg, 'ui', 'pointing', 'red', 'basic', 'label', 'large',
              { [styles.hide]: notificationEmailError === '' })}
          >
            {notificationEmailError}
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
