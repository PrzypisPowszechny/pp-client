
export function userLoggedInAlias(...args) {
  return { type: 'userLoggedInAlias', args };
}

export function userLoggedOutAlias(...args) {
  return { type: 'userLoggedOutAlias', args };
}
