import { selectUserForDashboard } from 'common/store/storage/selectors';
import store from './store';
import Port = chrome.runtime.Port;

class DashboardMessaging {
  dashboardPort: Port;

  init() {
    chrome.runtime.onConnectExternal.addListener((port) => {
      console.log('connext')
      this.dashboardPort = port;
      this.dashboardPort.onMessage.addListener(this.dashboardMessageHandler);
    });
  }

  dashboardMessageHandler = (request, port) => {
    console.log('sdf')
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
    this.getPort().postMessage({
      action: 'UPDATE_LOGIN_DATA',
      payload: selectUserForDashboard(store.getState()),
    });
  }
}

export default new DashboardMessaging();
