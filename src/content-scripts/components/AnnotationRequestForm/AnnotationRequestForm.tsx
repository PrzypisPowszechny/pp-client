import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './AnnotationRequestForm.scss';
import { PPScopeClass } from 'content-scripts/settings';
import { turnOffRequestMode } from 'common/chrome-storage';
import { AppModes } from 'content-scripts/store/appModes/types';
import { Icon } from 'react-icons-kit';
import { ic_live_help } from 'react-icons-kit/md/ic_live_help';
import ppGA from 'common/pp-ga';

export interface IAnnotationRequestFormProps {
  appModes: AppModes;
}

@connect(
  state => ({
    appModes: state.appModes,
  }),
)
export default class AnnotationRequestForm extends React.Component<Partial<IAnnotationRequestFormProps>, {}> {

  handleCancelClick = (e: any) => {
    turnOffRequestMode(this.props.appModes);
    // ppGA.annotationAddingModeCancelled();
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
              Zgłoś do sprawdzenia fragment z tej strony, a dodamy jego miejscu przypis z naszą oceną wiarygodności i źródłem.
            </p>
        </div>
        <div className={styles.label}>Fragment do sprawdzenia</div>
        <textarea
            className={styles.formField}
            autoFocus={true}
            name="quote"
            placeholder="Przeklej fragment artykułu"
        />
        <div className={styles.label}>Komentarz (opcjonalny)</div>
        <textarea
            className={styles.formField}
            name="quote"
            placeholder="Napisz, na co zwrócić szczególną uwagę"
        />
        <div className={styles.label}>Twój adres e-mail (opcjonalny)</div>
        <p className={styles.caption}>Zostaw adres e-mail, jeśli chcesz żebyśmy powiadomili Cię, kiedy dodamy w tym miejscu przypis
        </p>
        <input
            className={styles.formField}
            name="email"
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
                onClick={this.handleCancelClick}
            >
            Wyślij
            </button>
        </div>
      </div>
    );
  }
}
