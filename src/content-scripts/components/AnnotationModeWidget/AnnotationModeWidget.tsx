import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './AnnotationModeWidget.scss';
import { PPScopeClass } from 'content-scripts/settings';
import { turnOffAnnotationMode } from 'common/chrome-storage';
import { AppModes } from 'common/store/tabs/tab/appModes/types';
import Button from '../elements/Button/Button';
import ppGa from 'common/pp-ga';
import { hideMenu } from 'common/store/tabs/tab/widgets/actions';
import { selectTab } from 'common/store/tabs/selectors';

export interface IAnnotationModeWidgetProps {
  appModes: AppModes;
  hideMenu: () => void;
}

@connect(
  state => ({
    appModes: selectTab(state).appModes,
  }),
  { hideMenu },
)
export default class AnnotationModeWidget extends React.Component<Partial<IAnnotationModeWidgetProps>, {}> {

  handleCancelClick = (e: any) => {
    this.props.hideMenu();
    turnOffAnnotationMode(this.props.appModes, window.location.href);
    ppGa.annotationAddingModeCancelled();
  }

  render() {
    return (
      <div
        className={classNames(PPScopeClass, styles.self)}
      >
        <div className={styles.msg}>
          Zaznacz fragment tekstu, aby <br/> dodać przypis.
        </div>
        <Button appearance="primary" onClick={this.handleCancelClick}>
            Zakończ dodawanie
        </Button>
      </div>
    );
  }
}
