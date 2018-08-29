exports.appSettings = (env, argv) => {
  const safeEnv = env || {};
  const mode = argv && argv.mode;

  /*
   * APP SETTINGS OBJECT BELOW
   */
  return {
    DEV: getDevValue(safeEnv, mode),
    SITE_URL: getHostValue(safeEnv, mode) + '/site',
    API_URL: getHostValue(safeEnv, mode) + '/api',
  };
}

function getDevValue(env, mode) {
  switch (mode) {
    case 'production':
      return false;
    case 'development':
    default:
      return true;
  }
}

function getHostValue(env, mode) {
  switch (env.api) {
    case 'local':
        return "http://localhost:8000"
    case 'pp':
      return "https://przypispowszechny.pl"
    case 'devdeploy1':
    default:
      return "https://devdeploy1.przypispowszechny.pl"
  }
}
