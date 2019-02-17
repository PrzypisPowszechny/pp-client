
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

  permissions: [
    'storage',
    'activeTab',
    'contextMenus',
    'cookies',
    'identity',
    // API URL must be included so we can read cookies for this host
    loadSettings(env, argv).API_URL,
    loadSettings(env, argv).SITE_URL,
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval' " +
    "'sha256-f+jtQqnAOWw13zFV9cOoh2WD8+RB3JRJO+woYF/SDXE=' 'sha256-WBYdb3/MnwLecWA4GzzLBt3UJUojiveB4rGQSbn4F8Q=' " +
    "'sha256-HROwaOTY1vFxe7kzvbifq2xfIujew6iGbGsQ4ojPrd8=' 'sha256-BVTSC+YHi+LH7Ddi95E+Axi3JgO1qroFDIgIKG9xn48=' " +
    "'sha256-crnHhEX/6UNPmaIMhop20ilw90xxhnqSpajisArxH2s=' " +
    "https://www.google-analytics.com https://apis.google.com https://connect.facebook.net" +
    "; " +
    "object-src 'self'",
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
});

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
