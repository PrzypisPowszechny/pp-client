import * as bg from './bg';
import * as utils from './utils';
import { GACustomFieldsIndex } from './types';

jest.mock('common/pp-ga/ga', () => null);

const fieldsObject = { eventCategory: 'Something', eventAction: 'Happen', eventLabel: 'SomethingHappened' };

describe('sendMessage', () => {
  it('passes correct fields object', async () => {

    const gaMock = jest.fn();
    const getIamstaffMock = jest.fn();
    getIamstaffMock.mockReturnValue(Promise.resolve(false));
    Object.defineProperty(utils, 'getIamstaffFromCookie', { value:  getIamstaffMock });
    Object.defineProperty(global, 'ga', { value:  gaMock, writable: true });

    await bg.sendEvent(fieldsObject);

    expect(gaMock).toBeCalled();
    expect(gaMock).toBeCalledWith('send', 'event', { ...fieldsObject });
  });

  it('uses location option', async () => {

    const gaMock = jest.fn();
    const getIamstaffMock = jest.fn();
    getIamstaffMock.mockReturnValue(Promise.resolve(false));
    Object.defineProperty(utils, 'getIamstaffFromCookie', { value:  getIamstaffMock });
    Object.defineProperty(global, 'ga', { value:  gaMock, writable: true });

    const location = 'http://example.com/test';
    await bg.sendEvent(fieldsObject, { location });

    expect(gaMock).toBeCalled();
    expect(gaMock).toBeCalledWith('send', 'event',
      { ...fieldsObject, location, [GACustomFieldsIndex.eventUrl]: location },
    );
  });

  it('does not send event for staff', async () => {

    const gaMock = jest.fn();
    const getIamstaffMock = jest.fn();
    getIamstaffMock.mockReturnValue(Promise.resolve(true));
    Object.defineProperty(utils, 'getIamstaffFromCookie', { value:  getIamstaffMock });
    Object.defineProperty(global, 'ga', { value:  gaMock, writable: true });

    await bg.sendEvent(fieldsObject);

    expect(gaMock).toBeCalledTimes(0);
  });

  // TODO: add sendEventByMessage tests
});
