
import { configureAxios } from '../common/axios';
import { getCurrentTabUrl } from './utils';

export default function initWindow() {

  configureAxios(getCurrentTabUrl);
}
