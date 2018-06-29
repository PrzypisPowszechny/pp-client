import { createSelector } from 'reselect';
import { ITabState } from 'store/reducer';
import { standardizeUrlForPageSettings } from 'utils/url';

export const selectModeForCurrentPage = createSelector<ITabState, any, any>(
  state => state.appModes,
  (appModes) => {
    // Standardize the URL by disregarding stuff that does not identify a page like URL parameters etc.
    const currentStandardizedUrl = standardizeUrlForPageSettings(window.location.href);

    return {
    // Page highlights are disabled when
    //  the extension is disabled in general or when it is disabled for this particular page
      arePageHighlightsDisabled: appModes.isExtensionDisabled
      || appModes.disabledPages.indexOf(currentStandardizedUrl) !== -1,
      // Annotation mode is on when the current URL
      isAnnotationMode: appModes.annotationModePages.indexOf(currentStandardizedUrl) !== -1,
    };
  },
);
