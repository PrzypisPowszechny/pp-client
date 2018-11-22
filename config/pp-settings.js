const process = require('process');
let settingsLogged = false;

const packageConf = require('../package');

exports.loadSettings = (environment, argv) => {
  const env = environment || process.env;
  const mode = argv && argv.mode;
  const watch = argv && argv.watch;

  const settings = {
    DEV: getDev(env, mode),
    SITE_URL: getApi(env, mode) + '/site',
    API_URL: getApi(env, mode) + '/api',
    DEV_SENTRY_UNLOCATED_IGNORE: getDevSentryUnlocatedIgnore(env, mode),
    SENTRY_DSN: getSentryDSN(env, mode),
    VERSION: packageConf.version,
  };
  // Additional checks for production mode
  if (!settings.DEV) {
    if (settings.DEV_SENTRY_UNLOCATED_IGNORE) {
      throw Error('DEV_SENTRY_UNLOCATED_IGNORE set in production mode');
    }
    if (settings.SENTRY_DSN !== SENTRY_DSN_PROD) {
      throw Error('SENTRY_DSN not set to SENTRY_DSN_PROD in production mode');
    }
  }

  if (!settingsLogged) {
    settingsLogged = true;
    console.info(`PPSettings loaded from env:\n`, settings, `\n`);
  }
  return settings;
}


function getDev(env, mode) {
  const PP_DEV = env.PP_DEV || '';
  switch (PP_DEV.toLowerCase()) {
    case 'false':
    case '0':
      return false;
    case 'true':
    case '1':
    case '':
      return true;
    default:
      console.warn(`Ignoring unknown value of PP_DEV! To disable PP_DEV flag set it to 'false' or '0'.`);
      return true;
  }
}

function getApi(env, mode) {
  switch (env.PP_API) {
    case 'local':
    case 'localhost':
        return "http://localhost:8000"
    // Alternative localhost port - why not use it when running tests to avoid port clash with dev API?
    case 'local-alt':
    case 'localhost-alt':
        return "http://localhost:8080"
    case 'pp':
      return "https://przypispowszechny.pl"
    case 'devdeploy1':
    default:
      return "https://devdeploy1.przypispowszechny.pl"
  }
}


const SENTRY_DSN_DEV = 'https://3166a82a0a684e459e01b69db6d4db61@sentry.io/1305142';
const SENTRY_DSN_PROD = 'https://d2b3d8c96d404a44b41d9334e1b6733d@sentry.io/1305137';
const SENTRY_DSN_ANN_VALIDATE = 'https://207c88378fc246498a3403e284a7b43d@sentry.io/1324868';

function getSentryDSN(env, mode) {
  const dev = getDev(env, mode);
  switch(env.PP_DEV_SENTRY_ALT) {
    case 'ann-validate':
      return SENTRY_DSN_ANN_VALIDATE;
    default:
      if (dev) {
        return SENTRY_DSN_DEV;
      } else {
        return SENTRY_DSN_PROD;
      }
  }
}


function getDevSentryUnlocatedIgnore(env, mode) {
  switch (env.PP_DEV_SENTRY_UNLOCATED_IGNORE) {
    case 'false':
    case '0':
    case '':
      return false;
    case 'true':
    case '1':
      return true;
    default:
      return false;
  }
}
