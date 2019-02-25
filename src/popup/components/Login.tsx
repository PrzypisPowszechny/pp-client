import React from 'react';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

export default class Login extends React.Component<{}, {}> {

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

  getAuthData = (redirectUrl) => {
    if (chrome.runtime.lastError) {
      return;
    }

    // This is not real queryString, in OAuth is is queryString passed in hash fragment
    const queryString = redirectUrl.substr(redirectUrl.indexOf('#') + 1);
    const data = Login.parseQuery(queryString);

    const ppAuthParams = {
      expiresIn: data.expires_in,
      access_token: data.access_token,
      tokenType: data.token_type,
    };
    console.log(ppAuthParams);

    // TODO: pass ppAuthParams to /api/auth/{provider}/ endpoint and receive PP access token for PP frontend app
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
    }, this.getAuthData);
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
    }, getAuthData);
  }

  render() {
    return (
      <div>
        <GoogleLoginButton onClick={this.googleAuthorize}>Zaloguj się przez Google</GoogleLoginButton>
        <FacebookLoginButton onClick={this.fbAuthorize}>Zaloguj się przez Facebooka</FacebookLoginButton>
      </div>
    );
  }
}
