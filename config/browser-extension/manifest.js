
// A base for future manifest.json
// Contains only the most universal information;
const base = {
  manifest_version: 2,
  name: 'Przypis Powszechny',
  description: '',
  version: '0.1',

  permissions: [
    'activeTab',
    'identity',
    'identity.email',
    'https://ajax.googleapis.com/'
  ],
  oauth2: {
    client_id: '79553213007-8oueh36t82f23in0ig5qaomc1k05tnuu.apps.googleusercontent.com',
    scopes: ['profile']
  },
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  browser_action: {
    default_title: 'Przypis Powszechny - wersja testowa'
  },
  web_accessible_resources: [
    'fonts/*',
    '*.svg',
    '*.png'
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
