import React from 'react';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import styles from './Toast.scss';
import { Icon } from 'react-icons-kit';
import { check, x } from 'react-icons-kit/feather';
import { changeNotification } from '../../../store/widgets/actions';
import { connect } from 'react-redux';
import { selectTab } from '../../../../common/store/tabs/selectors';

export enum ToastType {
  success,
  failure,
}

interface ToastProps {
  message: string;
  visible: boolean;
  type: ToastType;
  changeNotification: (visible: boolean, message?: string, type?: ToastType) => void;
}

interface ToastState {
  visible: boolean;
}

@connect(
  state => selectTab(state).widgets.notification,
  { changeNotification },
)
export default class Toast extends React.Component <Partial<ToastProps>, Partial<ToastState>> {

  constructor(props: ToastProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    // Make the toast animated -- use the local state for fine-grained rendering control
    if (this.props.visible) {
      // appear with a delay
      setTimeout(() => this.setState({ visible: true }), 500);
    }

    setTimeout(() => this.setState({ visible: false }), 3000);
    // Make the toast disappearance visible no sooner than the animation ends
    setTimeout(() => this.props.changeNotification(false), 4000);
  }

  getIcon() {
    switch (this.props.type) {
      case ToastType.failure:
        return x;
      case ToastType.success:
      default:
        return check;
    }
  }

  render() {
    const { type } = this.props;

    return (
      <div
        className={classNames(
          PPScopeClass,
          styles.self, {
            [styles.hidden]: !this.state.visible,
            [styles.success]: type === ToastType.success,
            [styles.failure]: type === ToastType.failure,
          })}
      >
        <div className={styles.iconBox}>
          <Icon className={styles.icon} icon={this.getIcon()} size={26}/>
        </div>
        <div className={styles.message}>
          {this.props.message}
        </div>
      </div>
    );
  }
}
