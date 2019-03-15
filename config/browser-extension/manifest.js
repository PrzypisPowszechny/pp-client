
// A base for future manifest.json
// Contains only the most universal information;
// For more details see values appended in browser-extension/*.config.js file
const packageConf = require('../../package');
const loadSettings = require('../pp-settings').loadSettings;

const base = (env, argv) => ({
  manifest_version: 2,
  name: 'Przypis Powszechny',
  description: '',
  // chrome version can be composed of integers only, so strip alpha/beta/rc/etc part
  version: packageConf.version.split('-')[0],
  version_name: `${packageConf.version}`,
  content_security_policy: "script-src 'self' 'unsafe-eval' https://www.google-analytics.com; object-src 'self'",
  browser_action: {
    default_title: 'Przypis Powszechny - wersja testowa'
  },
  oauth2: {
    client_id: loadSettings(env, argv).CHROME_OAUTH_CLIENT_ID,
    scopes: ['email', 'profile']
  },
  web_accessible_resources: [
    'assets/*',
    'help/*',
    'node_modules/*',
    'fonts/*'
  ],
  permissions: [
    'storage',
    'activeTab',
    'contextMenus',
    'cookies',
    'identity',
    // server URLs must be included so we can read cookies for these hosts
    loadSettings(env, argv).API_URL,
    loadSettings(env, argv).SITE_URL,
  ],
});

const externallyConnectable = ['*://*.przypispowszechny.pl/*'];
if (loadSettings(env, argv).DEV)  {
  externallyConnectable.push('*://localhost/*');
}

base.externally_connectable = {
  matches: externallyConnectable,
};

const contentScriptSettings = {
  matches: ['<all_urls>'],
  exclude_matches: [
    /* Popular websites to which PP is not applicable
    Beware, these are not regular expressions / typical wildcard expressions:
    they are a special 3-part google URL match patterns.
    (see https://developer.chrome.com/extensions/match_patterns)
    */
    '*://*.google.com/*',
    '*://*.google.pl/*',
    '*://*.wikipedia.org/*',
    '*://*.facebook.com/*',
    '*://*.slack.com/*',
  ],
};

module.exports = {
  base,
  contentScriptSettings
};
