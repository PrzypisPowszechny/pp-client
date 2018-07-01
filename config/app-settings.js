exports.appSettings = (env, argv) => {
  const safeEnv = env || {};
  const mode = argv && argv.mode;

  /*
   * APP SETTINGS OBJECT BELOW
   */
  return {
    DEV: getDevValue(safeEnv, mode),
    API_URL: getApiUrlValue(safeEnv, mode),
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

function getApiUrlValue(env, mode) {
  switch (env.api) {
    case 'local':
        return "http://localhost:8000/api"
    case 'pp':
      return "https://przypispowszechny.pl/api"
    case 'devdeploy1':
    default:
      return "https://devdeploy1.przypispowszechny.pl/api"
  }
}
