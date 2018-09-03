import './ga.js';
import FieldsObject = UniversalAnalytics.FieldsObject;
import packageConf from '../../package.json';

const GA_ID_PROD = 'UA-123054125-1';
const GA_ID_DEV = 'UA-123054125-2';

export function init() {
  ga('create', PP_SETTINGS.DEV ? GA_ID_DEV : GA_ID_PROD);
  // Our extension protocol is chrome which is not what GA expects. It will fall back to http(s)
  ga('set', 'checkProtocolTask', () => { /* nothing */ });
  ga('set', 'appName', 'PP browser extension');
  ga('set', 'appVersion', packageConf.version);
}

function sendEvent(fieldsObject: FieldsObject) {
  ga('send', 'event', fieldsObject);
}

export function extensionInstalled() {
  sendEvent({ eventCategory: 'Extension', eventAction: 'install', eventLabel: 'ExtensionInstalled' });
}

export function extensionUpgradedFrom(previousVersion) {
  if (packageConf.version === previousVersion) {
    sendEvent({ eventCategory: 'Extension', eventAction: 'reinstall', eventLabel: 'ExtensionReinstalled' });
  } else {
    sendEvent({ eventCategory: 'Extension', eventAction: 'upgrade', eventLabel: 'ExtensionUpgraded' });
  }
}

// This need to be in fact implemented on our site frontend, not in the extension
export function extensionUninstalled() {
  sendEvent({eventCategory: 'Extension', eventAction: 'uninstall', eventLabel: 'ExtensionUninstalled' });
}
