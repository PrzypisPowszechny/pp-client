
import { configureAxios } from '../common/axios';
import { getCurrentTabUrl } from './utils';
import { getExtensionCookie } from '../common/messages';

export default function initWindow() {
  return Promise.resolve(
    configureAxios(getExtensionCookie),
  );
}
