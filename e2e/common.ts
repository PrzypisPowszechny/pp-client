import { dispatchDOMEvent } from './utils';
import { EMULATE_ON_PP_AUTH_RESPONSE } from './events';
// noinspection TsLint
const packageConf = require('../package');

export async function simulateLogIn(browser) {
  await browser.get(`chrome-extension://${packageConf.pp.devAppID}/popup.html`);
  return dispatchDOMEvent(browser, EMULATE_ON_PP_AUTH_RESPONSE, {
    data: {
      access: 'qwerty',
      userId: 'e2e.test@user.com',
      expires: 1234,
    },
  });
}
