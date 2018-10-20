import * as Sentry from '@sentry/browser';

const SENTRY_DSN_DEV = 'https://3166a82a0a684e459e01b69db6d4db61@sentry.io/1305142';
const SENTRY_DSN_PROD = 'https://d2b3d8c96d404a44b41d9334e1b6733d@sentry.io/1305137';

// Install sentry in the window. From now on: anything bad happens in the browser, we know it.
export function init() {
  Sentry.init({
    dsn: PPSettings.DEV ? SENTRY_DSN_DEV : SENTRY_DSN_PROD,
    debug: PPSettings.DEV,
  });
}
