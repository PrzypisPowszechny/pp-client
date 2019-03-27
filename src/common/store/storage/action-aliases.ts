
export function userLoggedInAlias(...args) {
  return { type: 'userLoggedInAlias', args };
}

export function accessTokenRefreshAlias(...args) {
  return { type: 'accessTokenRefreshAlias', args };
}

export function userLoggedOutAlias(...args) {
  return { type: 'userLoggedOutAlias', args };
}
