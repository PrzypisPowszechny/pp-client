import { dispatchDOMEvent } from './utils';
import { EMULATE_ON_PP_AUTH_RESPONSE } from './events';
// noinspection TsLint
const packageConf = require('../package');

export async function simulateLogIn(browser) {
  await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
  // wait to make sure the event is already listened for
  await new Promise(resolve => setTimeout(resolve, 500));
  return dispatchDOMEvent(browser, 'EMULATE_ON_PP_AUTH_RESPONSE', {
    data: {
      access: 'access-token',
      userId: 'e2e.test@user.com',
      refresh: 'refresh-token',
    },
  });
}
