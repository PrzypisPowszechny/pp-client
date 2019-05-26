import React from 'react';
import { connect } from 'react-redux';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

import { initiateAuthProc } from 'common/store/runtime/actions';
import { AuthProviders } from 'common/store/runtime/types';
import { userDataNew } from 'common/store/storage/actions';

import { EMULATE_ON_PP_AUTH_RESPONSE } from '../../../e2e/shared/events';

export interface LoginFormProps {
  userDataNew: (userData) => void;
  initiateAuthProc: (provider: AuthProviders) => void;
}

@connect(
  state => ({}),
  {
    userDataNew,
    initiateAuthProc,
  },
)
export default class LoginForm extends React.Component<Partial<LoginFormProps>> {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidMount() {
    document.addEventListener(EMULATE_ON_PP_AUTH_RESPONSE, this.onPPLoginSimulate);
  }

  componentWillUnmount() {
    document.removeEventListener(EMULATE_ON_PP_AUTH_RESPONSE, this.onPPLoginSimulate);
  }

  // used in e2e tests to log in
  onPPLoginSimulate = (e: CustomEvent) => {
    this.props.userDataNew(e.detail);
  }

  googleAuthenticate = () => {
    this.props.initiateAuthProc(AuthProviders.google);
  }

  fbAuthenticate = () => {
    this.props.initiateAuthProc(AuthProviders.facebook);
  }

  render() {
    return (
      <div>
        <GoogleLoginButton className="google-login-button" onClick={this.googleAuthenticate}>Zaloguj się przez
          Google</GoogleLoginButton>
        <FacebookLoginButton className="fb-login-button" onClick={this.fbAuthenticate}>Zaloguj się przez
          Facebooka</FacebookLoginButton>
      </div>
    );
  }
}
