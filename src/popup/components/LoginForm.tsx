import React from 'react';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { connect } from 'react-redux';
import { userLoggedIn } from '../../common/store/storage/actions';
import axios from 'axios';
import { EMULATE_ON_PP_AUTH_RESPONSE } from '../../../e2e/events';
import {
  FacebookCredentials,
  GoogleCredentials,
  PPLoginResponseAPIModel,
  PPIntegrationCredentialsAPIModel
} from 'common/api/auth';
import * as Sentry from '@sentry/browser';

export interface LoginFormProps {
  userLoggedIn: (userData) => void;
}

interface LoginFormState {
  error: string;
}

@connect(
  state => ({}),
  {
    userLoggedIn,
  },
)
export default class LoginForm extends React.Component<Partial<LoginFormProps>, Partial<LoginFormState>> {

  static parseParams(queryString): GoogleCredentials | FacebookCredentials {
    const query: any = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  static parsePostAuthenticateRedirectURL = (redirectUrl) => {
    // This is not real queryString, in OAuth is is queryString passed in hash fragment
    const queryString = redirectUrl.substr(redirectUrl.indexOf('#') + 1);
    return LoginForm.parseParams(queryString);
  }

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
    this.dispatchUserLoggedIn(e.detail);
  }

  dispatchUserLoggedIn = (response: PPLoginResponseAPIModel) => {
    this.props.userLoggedIn(response.data);
  }

  setErrorMessage() {
    this.setState({ error: 'W trakcie logowania wystąpił błąd' });
  }


  ppAuthenticate(authResponse, provider) {
    let authParams;
    try {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      authParams = LoginForm.parsePostAuthenticateRedirectURL(authResponse);
    } catch (err) {
      Sentry.captureException(err);
      this.setErrorMessage();
    }

    const data: PPIntegrationCredentialsAPIModel = {
      data: {
        // fb uses camelcase while google underscores
        accessToken: authParams.accessToken || authParams.access_token,
        expiresIn: authParams.expiresIn || authParams.expires_in,
        tokenType: authParams.tokenType || authParams.token_type,
      },
    };

    axios({
      method: 'post',
      url: `${PPSettings.API_URL}/auth/${provider}/`,
      data,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    }).then(resp => this.dispatchUserLoggedIn(resp.data))
      .catch((err) => {
        Sentry.captureException(err);
        this.setErrorMessage();
      });
  }

  googleAuthenticate = () => {
    const redirectURL = chrome.identity.getRedirectURL();
    const clientID = '823340157121-mplb4uvgu5ena8fuuuvvnpn773hpjim4.apps.googleusercontent.com';
    const scopes = ['email', 'profile'];
    let authURL = 'https://accounts.google.com/o/oauth2/auth';
    authURL += `?client_id=${clientID}`;
    authURL += `&response_type=token`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

    return chrome.identity.launchWebAuthFlow({
      interactive: true,
      url: authURL,
    }, data => this.ppAuthenticate(data, 'google'));
  }

  fbAuthenticate = () => {
    const redirectURL = chrome.identity.getRedirectURL();
    const appID = '2290339024350798';
    const scopes = ['email', 'public_profile'];
    let authURL = 'https://www.facebook.com/v2.9/dialog/oauth';
    authURL += `?client_id=${appID}`;
    authURL += `&response_type=token`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

    return chrome.identity.launchWebAuthFlow({
      interactive: true,
      url: authURL,
    }, data => this.ppAuthenticate(data, 'facebook'));
  }

  render() {
    return (
      <div>
        <GoogleLoginButton className="google-login-button" onClick={this.googleAuthenticate}>Zaloguj się przez
          Google</GoogleLoginButton>
        <FacebookLoginButton className="fb-login-button" onClick={this.fbAuthenticate}>Zaloguj się przez
          Facebooka</FacebookLoginButton>
        <span>{this.state.error}</span>
      </div>
    );
  }
}
