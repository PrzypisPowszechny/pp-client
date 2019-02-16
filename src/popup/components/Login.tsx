import React from 'react';

export default class Toggle extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
  }

  parseQuery (queryString): any {
    const query = {};
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  getAuthData = redirectUrl => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return;
    }
    console.log(redirectUrl);
    // The alert does not appear unless inspection window is open, so we can be sure popup window really gets killed
    alert(redirectUrl);

    // This is not real queruString, in OAuth is is queryString passed in hash fragment
    const queryString = redirectUrl.substr(redirectUrl.indexOf('#') + 1);
    const data = this.parseQuery(queryString);

    const ppAuthParams = {
      expiresIn: data.expires_in,
      access_token: data.access_token,
      tokenType: data.token_type,
    };
    console.log(ppAuthParams);

    // TODO: pass ppAuthParams to /api/auth/{provider}/ endpoint and receive PP access token for PP frontend app
  }

  ;

  googleAuthorize = () => {
    const redirectURL = chrome.identity.getRedirectURL();
    const clientID = "823340157121-mplb4uvgu5ena8fuuuvvnpn773hpjim4.apps.googleusercontent.com";
    const scopes = ["email", "profile"];
    let authURL = "https://accounts.google.com/o/oauth2/auth";
    authURL += `?client_id=${clientID}`;
    authURL += `&response_type=token`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

    console.log(authURL);

    return chrome.identity.launchWebAuthFlow({
      interactive: true,
      url: authURL
    }, this.getAuthData);
  };

  fbAuthorize = () => {
    const getAuthData = this.getAuthData;
    const func = function() {
      const redirectURL = chrome.identity.getRedirectURL();
      const appID = "2290339024350798";
      const scopes = ["email", "public_profile"];
      let authURL = "https://www.facebook.com/v2.9/dialog/oauth";
      authURL += `?client_id=${appID}`;
      authURL += `&response_type=token`;
      authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
      authURL += `&scope=${encodeURIComponent(scopes.join(' '))}`;

      console.log(authURL);

      return chrome.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL
      }, getAuthData);
    };
    // This is 'asyn' implementation and it works (popup is not blocked by browser),
    // so we can assume it should work from background page as well
    setTimeout(func, 100);
  };

  render() {
    return (
      <div>
        <button onClick={this.googleAuthorize}>Google log in</button>
        <button onClick={this.fbAuthorize}>Facebook log in</button>
      </div>
    )
  }
}
