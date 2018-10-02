
## Development -- details


### Mocking API

Since we use `redux-json-api` module as a Redux-state intermediary
between the actual HTTP API (at least our own, PP API) and the application,
all incoming HTTP data can be mocked by calling certain Redux store actions.

Here is an autonomous code stub that can be used for this purpose:

```typescript
import { API_READ } from 'redux-json-api';
import { createAction, handleActions } from 'redux-actions';
const apiRead = createAction('API_READ');
// place your mocked response json here
import mock_response from '../my_mock_response.json';
function loadMockData() {
  const endpoint = '/annotations'; // json api resource type
  const options = {};
  store.dispatch(apiRead({ endpoint, options, ...mock_response }));
}
```
