import * as chromeKeys from './keys';
import { standardizeUrlForPageSettings } from 'utils/url';

// todo: provide a better way of simulating extension environment
const storage = {
  get,
  set,
  onChanged: {
    addListener: callback => ({ }),
  },
};

export default storage;

function get(keys, callback) {
  if (keys.indexOf(chromeKeys.ANNOTATION_MODE_PAGES) !== -1) {
    const result = {
      [chromeKeys.ANNOTATION_MODE_PAGES]: [standardizeUrlForPageSettings(window.location.href)],
    };
    callback(result);
  }
}

function set(values, callback) {
  if (typeof callback !== 'undefined') {
    callback();
  }
}
