
export function checkResponse(response, name) {
  let error;
  let value;
  if (!response) {
    error = new Error(`Background script did not respond in ${name}`);
  } else {
    value = response.value;
    if (!response.hasOwnProperty('value')) {
      error = new Error(`Background script response malformed in ${name}: ${JSON.stringify(response)}`);
    }
    if (response.error) {
      error = new Error(`Error in background script in ${name}: ${response.error}`);
    }
  }
  return [value, error];
}
