import React from 'react';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { connect } from 'react-redux';
import { userLoggedIn } from '../../common/store/storage/actions';
import axios from 'axios';
import { EMULATE_ON_PP_AUTH_RESPONSE } from '../../../e2e/events';

export interface LoginProps {
  userLoggedIn: (userData) => void;
}

@connect(
  state => ({}),
  {
    userLoggedIn,
  },
)
export default class Login extends React.Component<Partial<LoginProps>, {}> {

  static parseQuery(queryString): any {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener(EMULATE_ON_PP_AUTH_RESPONSE, this.onPPAuthResponse);
  }

  onPPAuthResponse = (e: CustomEvent) => {
    const response = e.detail;
    this.saveLoginState(response);
  }

  saveLoginState = (response) => {
    const prom = this.props.userLoggedIn(response.data);
  }

  getAuthData = (redirectUrl) => {
    if (chrome.runtime.lastError) {
      return;
    }

    // This is not real queryString, in OAuth is is queryString passed in hash fragment
    const queryString = redirectUrl.substr(redirectUrl.indexOf('#') + 1);
    return Login.parseQuery(queryString);
  }

  logIn(authResponse, provider) {
    const authParams = this.getAuthData(authResponse);
    const data = {
      // fb uses camelcase while google underscores
      accessToken: authParams.accessToken || authParams.access_token,
      expiresIn: authParams.expiresIn || authParams.expires_in,
      tokenType: authParams.tokenType || authParams.token_type,
    };

    axios({
      method: 'post',
      url: `${PPSettings.API_URL}/auth/${provider}/`,
      data: { data },
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    }).then(resp => this.saveLoginState(resp.data));
  }

  googleAuthorize = () => {
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
    }, data => this.logIn(data, 'google'));
  }

  fbAuthorize = () => {
    const getAuthData = this.getAuthData;
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
    }, data => this.logIn(data, 'facebook'));
  }

  render() {
    return (
      <div>
        <GoogleLoginButton className="google-login-button" onClick={this.googleAuthorize}>Zaloguj się przez
          Google</GoogleLoginButton>
        <FacebookLoginButton className="fb-login-button" onClick={this.fbAuthorize}>Zaloguj się przez
          Facebooka</FacebookLoginButton>
      </div>
    );
  }
}
