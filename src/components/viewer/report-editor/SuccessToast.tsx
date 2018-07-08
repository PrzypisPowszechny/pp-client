import React from 'react';
import classNames from 'classnames';

import styles from './ReportEditor.scss';
import { PPScopeClass } from '../../../class_consts';
import Timer = NodeJS.Timer;

interface ISuccessToastProps {
  onFinish: () => void;
}

interface ISuccessToastState {
  opacity: number;
}

export default class SuccessToast extends React.Component<Partial<ISuccessToastProps>, Partial<ISuccessToastState>> {

  static defaultState = {
    opacity: 1,
  };

  waitPeriod = 4000;
  fadeOutPeriod = 5000;
  tickPeriod = 100;

  timer: Timer = null;
  intervalId: Timer = null;

  constructor(props: ISuccessToastProps) {
    super(props);
    this.state = SuccessToast.defaultState;
    this.waitStart();
  }

  waitStart = () => {
    this.timer = setTimeout(this.fadeOutStart, this.waitPeriod);
  }

  fadeOutStart = () => {
    this.intervalId = setInterval(this.fadeOutTick, (this.fadeOutPeriod / this.tickPeriod));
  }

  fadeOutTick = () => {
    if (this.state.opacity > 0) {
      this.setState({ opacity: this.state.opacity -  1 / (this.fadeOutPeriod / this.tickPeriod) });
    } else {
      clearInterval(this.timer);
      this.props.onFinish();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div
        className={classNames(styles.self, styles.selfOffset, styles.toast)}
        style={{ opacity: this.state.opacity }}
      >
        <div className={classNames(PPScopeClass, styles.selfEdge, styles.toast)}>
          Twoje zgłoszenie zostało wysłane. Dziękujemy, że pomagasz nam ulepszać przypisy.
        </div>
      </div>

    );
  }
}
