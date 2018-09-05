import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './AnnotationModeWidget.scss';
import { PPScopeClass } from '../../class_consts';
import { turnOffAnnotationMode } from '../../chrome-storage';
import { AppModes } from 'store/appModes/types';
import ppGA from '../../pp-ga';

export interface IAnnotationModeWidgetProps {
  appModes: AppModes;
}

@connect(
  state => ({
    appModes: state.appModes,
  }),
)
export default class AnnotationModeWidget extends React.Component<Partial<IAnnotationModeWidgetProps>, {}> {

  handleCancelClick = (e: any) => {
    turnOffAnnotationMode(this.props.appModes);
    ppGA.annotationAddingModeCancelled();
  }

  render() {
    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div className={styles.msg}>
          Zaznacz fragment tekstu, aby <br/> dodać przypis.
        </div>
        <button
          className={styles.cancelButton}
          onClick={this.handleCancelClick}
        >
          Anuluj
        </button>
      </div>
    );
  }
}
