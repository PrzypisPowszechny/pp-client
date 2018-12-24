import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import { turnOffRequestMode } from 'common/chrome-storage';
import { AppModes } from 'content-scripts/store/appModes/types';
import { saveAnnotationRequest } from 'common/api/utils';
import ppGA from 'common/pp-ga';

import styles from './AnnotationRequestForm.scss';
import { Icon } from 'react-icons-kit';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import { changeNotification } from '../../store/widgets/actions';

export interface AnnotationRequestFormData {
  quote: string;
  comment: string;
  notificationEmail: string;
}

export interface AnnotationRequestFormProps {
  // showNotification: (message: string) => void;
  appModes: AppModes;
  changeNotification: (visible: boolean, message?: string) => void;
}

interface AnnotationRequestFormState extends AnnotationRequestFormData {
  // formData: AnnotationRequestFormData;
  isSent: boolean;
}

@connect(
  state => ({
    appModes: state.appModes,
  }),
  { changeNotification },
)
export default class AnnotationRequestForm extends React.Component< Partial<AnnotationRequestFormProps>, Partial<AnnotationRequestFormState>> {

  constructor(props: AnnotationRequestFormProps) {
    super(props);

    this.state = {
      quote: '',
      comment: '',
      notificationEmail: '',
     };
  }

  handleCancelClick = (e: any) => {
    turnOffRequestMode(this.props.appModes);
    ppGA.annotationAddingModeCancelled();
  }

  handleSubmit = (e) => {
    const { quote, comment, notificationEmail } = this.state;
    const url = window.location.href;

    // TODO validate
    saveAnnotationRequest({
      url, quote, comment, notificationEmail,
    }).then((response) => {
      console.log('annotation request sent!');
      this.setState({ isSent: true });
      // this.props.showNotification('Twoja prośba o przypis została wysłana');
      this.props.changeNotification(true, 'Twoja prośba o przypis została wysłana')
      turnOffRequestMode(this.props.appModes);
    });
  }

  render() {
    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div>
            <div className={styles.header}>
                <Icon className={styles.headerIcon} icon={ic_live_help} size={27}/>
                Poproś o przypis
            </div>
            <p className={styles.description}>Masz wątpliwości, czy to, co czytasz, ma sens? <br />
              Zgłoś do sprawdzenia fragment z tej strony,
               a dodamy jego miejscu przypis z naszą oceną wiarygodności i źródłem.
            </p>
        </div>
        <div className={styles.label}>Fragment do sprawdzenia</div>
        <textarea
            className={styles.formField}
            autoFocus={true}
            name="quote"
            placeholder="Przeklej fragment artykułu"
            value={this.state.quote}
            onChange={(e) => this.setState({ quote: e.target.value })}
        />
        <div className={styles.label}>Komentarz (opcjonalny)</div>
        <textarea
            className={styles.formField}
            name="quote"
            placeholder="Napisz, na co zwrócić szczególną uwagę"
            value={this.state.comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
        />
        <div className={styles.label}>Twój adres e-mail (opcjonalny)</div>
        <p className={styles.caption}>
          Zostaw adres e-mail, jeśli chcesz żebyśmy powiadomili Cię, kiedy dodamy w tym miejscu przypis
        </p>
        <input
            className={styles.formField}
            name="email"
            value={this.state.notificationEmail}
            onChange={(e) => this.setState({ notificationEmail: e.target.value })}
        />
        <div className={styles.actions}>
            <button
                className={classNames(styles.formButton, styles.cancel)}
                onClick={this.handleCancelClick}
            >
            Anuluj
            </button>
            <button
                className={classNames(styles.formButton, styles.save)}
                onClick={this.handleSubmit}
            >
            Wyślij
            </button>
        </div>
      </div>
    );
  }
}
