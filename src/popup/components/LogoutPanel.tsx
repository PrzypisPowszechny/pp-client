import React from 'react';
import { connect } from 'react-redux';

import { userLoggedOutAlias } from 'common/store/storage/action-aliases';
import { selectUser } from 'common/store/storage/selectors';

interface LogoutProps {
  user: any;

  userLoggedOutAlias: () => void;
}

@connect(
  state => ({
    user: selectUser(state),
  }),
  {
    userLoggedOutAlias,
  },
)
export default class LogoutPanel extends React.Component<Partial<LogoutProps>, {}> {

  constructor(props: LogoutProps) {
    super(props);
  }

  userLoggedOutHandler = () => {
    this.props.userLoggedOutAlias();
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
