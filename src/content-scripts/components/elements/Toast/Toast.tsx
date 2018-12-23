import React from 'react';
import classNames from 'classnames';
import { PPScopeClass } from 'content-scripts/settings';
import styles from './Toast.scss';
import { Icon } from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

interface ToastProps {
  message: string;
}

interface ToastState {
  hidden: boolean;
}

export default class Toast extends React.Component <Partial<ToastProps>, Partial<ToastState>> {

  constructor(props: ToastProps) {
    super(props);

    this.state = {
      hidden: true,
     };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ hidden: false }), 500);
    setTimeout(() => this.setState({ hidden: true }), 3000);
  }
  
  render() {
    return (
      <div className={classNames(PPScopeClass, styles.self, { [styles.hidden]: this.state.hidden })}>
        <div className={styles.iconBox}>
          <Icon className={styles.icon} icon={check} size={26}/>
        </div>
        <div className={styles.message}>
          {this.props.message}
        </div>
      </div>
    );
  }
}
