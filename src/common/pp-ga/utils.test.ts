import * as utils from './utils';
import * as chromeKeys from '../chrome-storage/keys';

// @ts-ignore
global.chrome = {
  storage: {
    local: {
      get: (keys, callback) => callback({ [chromeKeys.IAMSTAFF]: iamstaffValue }),
    },
  },
};

let iamstaffValue;
/*
 This more a demo of dealing with storage rather than a real test, although it does some simply checks
 */
describe('getIamstaff', () => {
  it('returns stored value', async () => {
    iamstaffValue = false;
    expect(await utils.getIamstaff()).toBeFalsy();

    iamstaffValue = true;
    expect(await utils.getIamstaff()).toBeTruthy();
  });
});
