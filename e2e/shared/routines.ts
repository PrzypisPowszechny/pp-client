import { dispatchDOMEvent, sleep } from '../utils';
import { EMULATE_ON_PP_AUTH_RESPONSE } from './events';
import { IUserState } from '../../src/common/store/storage/types';
// noinspection TsLint
const packageConf = require('../../package');

export async function simulateLogIn(browser) {
  await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
  // wait to make sure the event is already listened for
  await sleep(500);
  const data: IUserState = {
    access: 'access-token',
    refresh: 'refresh-token',
    userId: '2',
    userEmail: 'e2e.test@user.com',
    userRole: 'editor',
  };
  return dispatchDOMEvent(browser, 'EMULATE_ON_PP_AUTH_RESPONSE', data);
}
