import { selectUserForDashboard } from 'common/store/storage/selectors';
import Port = chrome.runtime.Port;
import { IState } from '../common/store/reducer';
import { Store } from 'redux';
import store from './store';

// A simplified implementation updating only the latest opened tab with dashboard
class DashboardMessaging {
  dashboardPort: Port;
  portName = 'DASHBOARD';
  store: Store<IState>;

  constructor(store: Store<IState>) {
    this.store = store;
  }

  init() {
    chrome.runtime.onConnectExternal.addListener((port: Port) => {
      if (port.name === this.portName) {
        this.dashboardPort = port;
        this.dashboardPort.onMessage.addListener(this.dashboardMessageHandler);
      }
    });
  }

  dashboardMessageHandler = (request, port) => {
    if (request.action === 'GET_LOGIN_DATA') {
      this.sendLoginData();
    }
  }

  getPort() {
    if (!this.dashboardPort) {
      throw new Error('Port connection with dashboard not initiated');
    }
    return this.dashboardPort;
  }

  sendLoginData() {
    if (this.dashboardPort) {
      try {
        this.dashboardPort.postMessage({
          action: 'UPDATE_LOGIN_DATA',
          payload: selectUserForDashboard(this.store.getState()),
        });
      } catch (err) {
        // ignore disconnected dashboard tabs
      }
    }
  }
}

export default new DashboardMessaging(store);
