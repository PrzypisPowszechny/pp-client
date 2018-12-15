import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './AnnotationModeWidget.scss';
import { PPScopeClass } from 'content-scripts/settings';
import { turnOffRequestMode } from 'common/chrome-storage';
import { AppModes } from 'content-scripts/store/appModes/types';
import ppGA from 'common/pp-ga';

export interface IRequestModeWidgetProps {
  appModes: AppModes;
}

@connect(
  state => ({
    appModes: state.appModes,
  }),
)
export default class RequestModeWidget extends React.Component<Partial<IRequestModeWidgetProps>, {}> {

  handleCancelClick = (e: any) => {
    turnOffRequestMode(this.props.appModes);
    // ppGA.annotationAddingModeCancelled();
  }

  render() {
    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div className={styles.msg}>
          Prośba o przypis
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
