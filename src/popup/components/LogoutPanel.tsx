import React from 'react';
import { connect } from 'react-redux';
import { selectUser } from '../../common/store/storage/selectors';
import { userLoggedOut } from '../../common/store/storage/actions';
import dashboardMessaging from '../../background/dashboard-messaging';

interface LogoutProps {
  user: any;

  userLoggedOut: () => void;
}

@connect(
  (state) => ({
    user: selectUser(state),
  }),
  {
    userLoggedOut,
  },
)
export default class LogoutPanel extends React.Component<Partial<LogoutProps>, {}> {

  constructor(props: LogoutProps) {
    super(props);
  }

  userLoggedOutHandler = async () => {
    await this.props.userLoggedOut();
    dashboardMessaging.sendLoginData();
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <button onClick={this.userLoggedOutHandler}> Wyloguj </button>
      </div>
    );
  }
}
