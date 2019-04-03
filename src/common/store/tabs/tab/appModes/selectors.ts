import { createSelector } from 'reselect';
import { ITabState } from 'common/store/tabs/tab/reducer';
import { standardizeUrlForPageSettings } from 'common/url';
import { AppModes } from './types';
import { selectTab } from 'common/store/tabs/selectors';

export function isAnnotationMode(appModes: AppModes) {
  const currentStandardizedUrl = standardizeUrlForPageSettings(window.location.href);
  return (appModes.annotationModePages || []).includes(currentStandardizedUrl) && !appModes.isExtensionDisabled;
}

export const selectModeForCurrentPage = createSelector<ITabState, any, any>(
  state => selectTab(state).appModes,
  (appModes) => {
    // Standardize the URL by disregarding stuff that does not identify a page like URL parameters etc.
    const currentStandardizedUrl = standardizeUrlForPageSettings(window.location.href);
    return {
      // Page highlights are disabled when
      //  the extension is disabled in general or when it is disabled for this particular page
      arePageHighlightsDisabled: appModes.isExtensionDisabled
      || appModes.disabledPages.indexOf(currentStandardizedUrl) !== -1,
      // Annotation mode is on when
      // - the current URL is included in annotationModePages
      // - the extension is not globally disabled
      isAnnotationMode: isAnnotationMode(appModes),
    };
  },
);
