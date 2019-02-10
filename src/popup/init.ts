
import { configureAxios } from '../common/axios';
import { getCurrentTabUrl } from './utils';

export default function initWindow() {
  return Promise.resolve(configureAxios(getCurrentTabUrl));
}
