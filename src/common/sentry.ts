import * as Sentry from '@sentry/browser';

// Install sentry in the window. From now on: anything bad happens in the browser, we know it.
export function init() {
  Sentry.init({
    dsn: PPSettings.SENTRY_DSN,
    debug: PPSettings.DEV,
    release: PPSettings.VERSION,
    beforeSend(event) {
      // Reporting observer events are unlike other ones, because they are "page-wide" and sentry is not able to filter
      // them out. That's why we look for our prefix (in webpack development mode) or suffix to collect only our errors.
      if (event.message && event.message.startsWith('ReportingObserver') && event.extra.body) {
        const { sourceFile } = event.extra.body;
        if (sourceFile && (sourceFile.startsWith('pp-webpack://') || sourceFile.indexOf('.pp-bundle.js') !== -1)) {
          return event;
        } else {
          return null;
        }
      }
      return event;
    },
  });
}
