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
    VERSION: packageConf.version,
  };
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
      return "https://devdeploy1.przypispowszechny.pl"
    case 'devdeploy1':
    default:
      return "https://devdeploy1.przypispowszechny.pl"
  }
}
