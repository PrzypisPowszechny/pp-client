
## Development -- details

### Redux architecture

#### Differences
Since we use [react-chrome-redux](https://github.com/tshaddix/react-chrome-redux)
there are some changes to note in respect to the normal Redux store:

##### Aliases

Asynchronous actions must be sent via
[aliases](https://github.com/tshaddix/react-chrome-redux#4-optional-implement-actions-whose-logic-only-happens-in-the-background-script-we-call-them-aliases).


##### dispatch

**All** dispatches are asynchronous and return a `Promise`.
This is because browser messaging API is asynchronous.

##### dispatches / renders

React rerenders are more likely to take place between different threads.
While the code below worked (luckily?) in classical Redux,
it does not anymore since annotation has already been removed in the promise handler:
```js
this.props.deleteAnnotation(this.props.annotation)
  .then(() => {
    const attrs = this.props.annotation.attributes;
    (...)
```

This works:
```js
const annotation = this.props.annotation;
this.props.deleteAnnotation(this.props.annotation)
  .then(() => {
    const attrs = annotation.attributes;
    (...)
```

#### Tab state

We keep tab state in Redux store.
Results of many actions depend on the tab for which the action was dispatched.
For this reason, we need to maintain this information so it is accessible in `tabs` reducer.


### Other

#### Mocking API

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
