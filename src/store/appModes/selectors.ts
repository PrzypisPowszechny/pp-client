import { createSelector } from 'reselect';
import { IStore } from 'store/reducer';
import { standardizeURL } from 'utils/url';

export const selectModeState = createSelector<IStore, any, any>(
  state => state.appModes,
  (appModes) => {
    const currentStandardizedURL = standardizeURL(window.location.href);
    console.log(appModes);
    return {
      disabledExtension: appModes.disabledExtension || appModes.disabledPages.indexOf(currentStandardizedURL) !== -1,
      annotationMode: appModes.annotationModePages.indexOf(currentStandardizedURL) !== -1,
    };
  },
);
