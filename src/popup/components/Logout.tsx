import React from 'react';
import { connect } from 'react-redux';
import { selectUser } from '../../common/store/storage/selectors';
import { userLoggedOut } from '../../common/store/storage/actions';

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
export default class Logout extends React.Component<Partial<LogoutProps>, {}> {

  constructor(props: LogoutProps) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <button onClick={this.props.userLoggedOut}> Wyloguj </button>
      </div>
    );
  }
}
