
// A base for future manifest.json
// Contains only the most universal information;

const VERSION = '0.1.0.3';

const base = {
  manifest_version: 2,
  name: 'Przypis Powszechny',
  description: '',
  version: VERSION,
  version_name: `${VERSION} test`,

  permissions: [
    'storage',
    'activeTab',
    'contextMenus',
  ],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  browser_action: {
    default_title: 'Przypis Powszechny - wersja testowa'
  },
  web_accessible_resources: [
    'assets/*',
    'help/*',
    'node_modules/*',
    'fonts/*'
  ]
};

const contentScriptSettings = {
  matches: ['<all_urls>'],
  exclude_matches: [
    /* Popular websites to which PP is not applicable
    Beware, these are not regular expressions: they are a special 3-part google URL match patterns.
    (see https://developer.chrome.com/extensions/match_patterns)
    */
    '*://*.google.com/*',
    '*://*.google.pl/*',
    '*://*.wikipedia.org/*',
    '*://*.facebook.com/*'
  ],
};

module.exports = {
  base,
  contentScriptSettings
};
