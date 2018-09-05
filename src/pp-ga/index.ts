import * as events from './events';
import { init, sendEventFromMessage } from './core';

export default {
  ...events,
  init,
  sendEventFromMessage,
};
