import React from 'react';
import { Icon } from 'react-icons-kit/Icon';
import { ic_person } from 'react-icons-kit/md/ic_person';
import { connect } from 'react-redux';

import { userLoggedOutAlias } from 'common/store/storage/action-aliases';
import { selectUser } from 'common/store/storage/selectors';

import { UserRoles } from '../../common/api/user';
import Button from '../../content-scripts/components/elements/Button/Button';

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
export default class UserPanel extends React.Component<Partial<LogoutProps>, {}> {

  constructor(props: LogoutProps) {
    super(props);
  }

  userLoggedOutHandler = () => {
    this.props.userLoggedOutAlias();
  }

  render() {
    const { userEmail, userRole } = this.props.user;
    return (
      <div>
        <div className="user-panel">
          <div className="user-info">
            <Icon className="user-icon" icon={ic_person} size={22}/>
            <div>
              <span> {userEmail.split('@')[0]} </span>
              {userRole === UserRoles.editor && <><br/><span className="user-role"> redaktor </span></>}
            </div>
          </div>
          <Button
            className="logout"
            appearance="link"
            onClick={this.userLoggedOutHandler}
          >
            Wyloguj
          </Button>
        </div>
      </div>
    );
  }
}
