/*
 * Redux-json-api helper that gets the resource type of the object read / created / updated / deleted via redux json api
 * based on the action
 */
export function getActionResourceType(action) {
  const { payload } = action;
  switch (action.type) {
    case 'API_READ':
      return payload.endpoint;
    case 'API_CREATED':
    case 'API_UPDATED':
      return payload.data.type;
    case 'API_DELETED':
      return payload.type;
  }
}
